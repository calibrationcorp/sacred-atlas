// ISO 3166-1 country and territory codes.
const countryCodes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
const displayNames = new Intl.DisplayNames(["en"], {type: "region"});
const collator = new Intl.Collator("en", {sensitivity: "base"});

export function worldwideCountries(listings) {
  const byCode = new Map(countryCodes.map(code => [code, displayNames.of(code)]));
  const coverage = new Set(listings.map(listing => listing.country));
  return [...new Set([...byCode.values(), ...coverage])].sort(collator.compare);
}

export const amenityLabels = {
  meals: "Meals included",
  private: "Private rooms available",
  shared: "Shared rooms available",
  transfer: "Airport transfers included",
  integration: "Integration support",
  vegan: "Vegan meals",
  yoga: "Yoga",
};

function normalizeSearch(value) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function filterRetreats(listings, filters, getPrice) {
  const terms = normalizeSearch(filters.q.trim()).split(/\s+/).filter(Boolean);
  return listings.filter(listing => {
    if (filters.country !== "all" && listing.country !== filters.country) return false;
    if (filters.region && filters.region !== "all" && listing.region !== filters.region) return false;
    if (filters.kind !== "all" && listing.kind !== filters.kind) return false;
    if (filters.modality !== "all" && !listing.modalities.includes(filters.modality)) return false;
    if (!filters.amenities?.every(amenity => listing.amenities?.includes(amenity)) && filters.amenities?.length) return false;

    const price = getPrice(listing);
    if (filters.priceStatus === "unknown" && price) return false;
    if (filters.priceStatus === "published" && !price) return false;
    if (filters.currency && filters.currency !== "all" && price?.currency !== filters.currency) return false;
    if (filters.maxPrice !== undefined && filters.maxPrice !== "" &&
        (!price || price.price > Number(filters.maxPrice))) return false;

    const searchable = normalizeSearch([
      listing.name, listing.address, listing.city, listing.region, listing.country,
      listing.note, ...listing.modalities, ...(listing.amenities ?? []).map(key => amenityLabels[key]),
    ].filter(Boolean).join(" "));
    return terms.every(term => searchable.includes(term));
  });
}
