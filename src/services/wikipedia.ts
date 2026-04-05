function extractTitleFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/wiki/");
    if (parts.length < 2) return null;
    return decodeURIComponent(parts[1]);
  } catch {
    return null;
  }
}

export async function fetchWikipediaSummary(authorName: string): Promise<string | null> {
  const title = encodeURIComponent(authorName.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "daily-inspiration-quote/1.0"
      }
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as { extract?: string };
    if (!data.extract) return null;
    return data.extract;
  } catch {
    return null;
  }
}

async function resolveViaLangLinks(
  englishUrl: string,
  authorName: string,
  targetLang: string
): Promise<string | null> {
  const titleFromUrl = extractTitleFromUrl(englishUrl);
  const title = titleFromUrl || authorName.replace(/\s+/g, "_");
  const apiUrl =
    "https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&titles=" +
    encodeURIComponent(title) +
    `&lllang=${encodeURIComponent(targetLang)}` +
    "&lllimit=1&format=json&origin=*";

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "daily-inspiration-quote/1.0"
    }
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    query?: {
      pages?: Record<string, { langlinks?: Array<{ title: string }> }>;
    };
  };

  const pages = data.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  const langTitle = firstPage?.langlinks?.[0]?.title;
  if (!langTitle) return null;

  return `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(langTitle.replace(/\s+/g, "_"))}`;
}

async function resolveViaDirectSummary(authorName: string, targetLang: string): Promise<string | null> {
  const title = encodeURIComponent(authorName.replace(/\s+/g, "_"));
  const url = `https://${targetLang}.wikipedia.org/api/rest_v1/page/summary/${title}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "daily-inspiration-quote/1.0"
    }
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { title?: string };
  if (!data.title) return null;

  return `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(data.title.replace(/\s+/g, "_"))}`;
}

async function resolveViaWikidata(
  englishUrl: string,
  authorName: string,
  targetLang: string
): Promise<string | null> {
  const titleFromUrl = extractTitleFromUrl(englishUrl);
  const title = titleFromUrl || authorName.replace(/\s+/g, "_");
  const pagePropsUrl =
    "https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=" +
    encodeURIComponent(title) +
    "&format=json&origin=*";

  const pagePropsRes = await fetch(pagePropsUrl, {
    headers: {
      "User-Agent": "daily-inspiration-quote/1.0"
    }
  });

  if (!pagePropsRes.ok) return null;

  const pagePropsData = (await pagePropsRes.json()) as {
    query?: { pages?: Record<string, { pageprops?: { wikibase_item?: string } }> };
  };

  const pages = pagePropsData.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  const wikidataId = firstPage?.pageprops?.wikibase_item;
  if (!wikidataId) return null;

  const entityUrl =
    "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=" +
    encodeURIComponent(wikidataId) +
    "&props=sitelinks&format=json&origin=*";

  const entityRes = await fetch(entityUrl, {
    headers: {
      "User-Agent": "daily-inspiration-quote/1.0"
    }
  });

  if (!entityRes.ok) return null;

  const entityData = (await entityRes.json()) as {
    entities?: Record<string, { sitelinks?: Record<string, { title: string }> }>;
  };

  const entity = entityData.entities?.[wikidataId];
  const siteKey = `${targetLang}wiki`;
  const siteLink = entity?.sitelinks?.[siteKey]?.title;
  if (!siteLink) return null;

  return `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(siteLink.replace(/\s+/g, "_"))}`;
}

async function resolveViaOpenSearch(authorName: string, targetLang: string): Promise<string | null> {
  const url =
    `https://${targetLang}.wikipedia.org/w/api.php?action=opensearch` +
    `&search=${encodeURIComponent(authorName)}` +
    "&limit=1&namespace=0&format=json&origin=*";

  const res = await fetch(url, {
    headers: {
      "User-Agent": "daily-inspiration-quote/1.0"
    }
  });

  if (!res.ok) return null;

  const data = (await res.json()) as [string, string[], string[], string[]];
  const titles = data?.[1] || [];
  if (titles.length === 0) return null;

  return `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(titles[0].replace(/\s+/g, "_"))}`;
}

export async function resolveWikipediaUrl(
  englishUrl: string,
  authorName: string,
  targetLang: string
): Promise<string> {
  if (!targetLang || targetLang.toLowerCase() === "en") {
    return englishUrl;
  }

  try {
    const byLangLinks = await resolveViaLangLinks(englishUrl, authorName, targetLang);
    if (byLangLinks) return byLangLinks;

    const byWikidata = await resolveViaWikidata(englishUrl, authorName, targetLang);
    if (byWikidata) return byWikidata;

    const direct = await resolveViaDirectSummary(authorName, targetLang);
    if (direct) return direct;

    const bySearch = await resolveViaOpenSearch(authorName, targetLang);
    if (bySearch) return bySearch;
  } catch {
    return englishUrl;
  }

  return englishUrl;
}
