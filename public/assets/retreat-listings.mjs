// Each entry uses the operator's published program price and amenities.
function retreat(id, name, country, modality, website, price, currency, duration, amenities, location = {}, references = []) {
  return {
    id, name, country, kind: "retreat", modalities: [modality],
    city: "", region: "", lat: null, lng: null, precision: "country", ...location,
    website, sources: [website, ...references], amenities,
    publishedPrice: {price, currency, duration, unit: "per person"},
    directOnly: true,
  };
}

const mycoWebsite = "https://mycomeditations.com/";
const mycoAmenities = ["meals", "private", "shared", "transfer", "integration"];
const treasureBeach = {city: "Treasure Beach", region: "Saint Elizabeth", lat: 17.878, lng: -77.768, precision: "city"};
const beckleyFaq = "https://www.beckleyretreats.com/faq";
const beckleyAmenities = ["meals", "private", "shared", "transfer", "integration", "yoga"];
const soltaraPricing = "https://www.soltara.co/book";
const soltaraAmenities = ["meals", "private", "shared", "integration"];

export const additionalRetreats = [
  retreat("myco-blue-marlin", "MycoMeditations · Blue Marlin", "Jamaica", "psilocybin",
    mycoWebsite, 6500, "USD", "8 days", mycoAmenities, treasureBeach),
  retreat("myco-rainbow-tree", "MycoMeditations · Rainbow Tree", "Jamaica", "psilocybin",
    mycoWebsite, 6800, "USD", "8 days", mycoAmenities, treasureBeach),
  retreat("myco-bluefields", "MycoMeditations · Bluefields Bay", "Jamaica", "psilocybin",
    mycoWebsite, 11800, "USD", "8 days", mycoAmenities,
    {city: "Bluefields", region: "Westmoreland", lat: 18.167, lng: -78.027, precision: "city"}),
  retreat("beckley-jamaica", "Beckley Retreats · Jamaica", "Jamaica", "psilocybin",
    "https://www.beckleyretreats.com/jamaica", 5500, "USD", "Signature program", beckleyAmenities,
    {lat: 18.13, lng: -77.30}, [beckleyFaq]),
  retreat("beckley-netherlands", "Beckley Retreats · Netherlands", "Netherlands", "psilocybin",
    "https://www.beckleyretreats.com/netherlands", 5200, "USD", "4 nights", beckleyAmenities,
    {lat: 52.13, lng: 5.29}, [beckleyFaq]),
  retreat("essence-netherlands", "Essence Institute · Core Retreat", "Netherlands", "psilocybin",
    "https://www.essence.nl/core-retreat/", 2050, "EUR", "3 days", ["meals", "private", "shared", "vegan", "integration", "yoga"],
    {lat: 52.13, lng: 5.29}),
  retreat("soltara-playa-blanca", "Soltara · Playa Blanca", "Costa Rica", "ayahuasca",
    "https://www.soltara.co/retreats", 3975, "USD", "5 nights", soltaraAmenities,
    {region: "Nicoya Peninsula", lat: 9.87, lng: -84.89, precision: "region"}, [soltaraPricing]),
  retreat("soltara-scarlet-valley", "Soltara · Scarlet Valley", "Costa Rica", "ayahuasca",
    "https://www.soltara.co/retreats", 3850, "USD", "5 nights", soltaraAmenities,
    {city: "Bijagual", region: "San José", lat: 9.78, lng: -84.58, precision: "city"}, [soltaraPricing]),
];

export function mergeRetreatListings(existing) {
  return existing.filter(listing => listing.id !== "c380").map(listing => {
    if (listing.id !== "c57") return listing;
    return {
      ...listing,
      amenities: ["meals", "yoga"],
      publishedPrice: {price: 4440, currency: "USD", duration: "12 days", unit: "per person"},
      sources: ["https://templeofthewayoflight.org/retreats/ayahuasca-retreat/", ...listing.sources],
    };
  }).concat(additionalRetreats);
}
