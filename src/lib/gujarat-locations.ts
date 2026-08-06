/**
 * Static map of all 33 Districts and their respective Talukas for the state of Gujarat, India.
 * This is used to populate dropdowns in the Admin panel for robust RBAC selection.
 */
export const GUJARAT_DISTRICTS_AND_TALUKAS: Record<string, string[]> = {
  "Ahmedabad": ["Ahmedabad City", "Bavla", "Daskroi", "Detroj-Rampura", "Dhandhuka", "Dholera", "Dholka", "Mandal", "Sanand", "Viramgam"],
  "Amreli": ["Amreli", "Babra", "Bagasara", "Dhari", "Jafrabad", "Khambha", "Kunkavav Vadia", "Lathi", "Lilia", "Rajula", "Savar Kundla"],
  "Anand": ["Anand", "Anklav", "Borsad", "Khambhat", "Petlad", "Sojitra", "Tarapur", "Umreth"],
  "Aravalli": ["Bayad", "Bhiloda", "Dhansura", "Malpur", "Meghraj", "Modasa"],
  "Banaskantha": ["Amirgadh", "Bhabhar", "Dantiwada", "Danta", "Deesa", "Deodar", "Dhanera", "Lakhani", "Palanpur", "Suigam", "Tharad", "Vadgam", "Vav"],
  "Bharuch": ["Amod", "Ankleshwar", "Bharuch", "Hansot", "Jambusar", "Jhagadia", "Netrang", "Vagra", "Valia"],
  "Bhavnagar": ["Bhavnagar", "Gariadhar", "Ghogha", "Jesar", "Mahuva", "Palitana", "Sihor", "Talaja", "Umrala", "Vallabhipur"],
  "Botad": ["Botad", "Barwala", "Gadhada", "Ranpur"],
  "Chhota Udaipur": ["Bodeli", "Chhota Udaipur", "Jetpur Pavi", "Kavant", "Nasvadi", "Sankheda"],
  "Dahod": ["Dahod", "Devgadh Baria", "Dhanpur", "Fatepura", "Garbada", "Limkheda", "Sanjeli", "Jhalod"],
  "Dang": ["Ahwa", "Subir", "Waghai"],
  "Devbhoomi Dwarka": ["Bhanvad", "Kalyanpur", "Khambhalia", "Okhamandal"],
  "Gandhinagar": ["Dahegam", "Gandhinagar", "Kalol", "Mansa"],
  "Gir Somnath": ["Gir Gadhada", "Kodinar", "Sutrapada", "Talala", "Una", "Veraval"],
  "Jamnagar": ["Dhrol", "Jamjodhpur", "Jamnagar", "Jodiya", "Kalavad", "Lalpur"],
  "Junagadh": ["Bhesan", "Junagadh City", "Junagadh Rural", "Keshod", "Malia Hatina", "Manavadar", "Mangrol", "Mendarda", "Vanthali", "Visavadar"],
  "Kheda": ["Balasinor", "Dakhor", "Fagvel", "Galteshwar", "Kapadvanj", "Kathlal", "Kheda", "Mahudha", "Matar", "Mehmedabad", "Nadiad", "Thasra", "Vaso"],
  "Kutch": ["Abdasa", "Anjar", "Bhachau", "Bhuj", "Gandhidham", "Lakhpat", "Mandvi", "Mundra", "Nakhatrana", "Rapar"],
  "Mahisagar": ["Balasinor", "Kadana", "Khanpur", "Lunawada", "Santrampur", "Virpur"],
  "Mehsana": ["Becharaji", "Jotana", "Kadi", "Kheralu", "Mehsana", "Satlasana", "Unjha", "Vadnagar", "Vijapur", "Visnagar"],
  "Morbi": ["Halvad", "Maliya", "Morbi", "Tankara", "Wankaner"],
  "Narmada": ["Dediapada", "Garudeshwar", "Nandod", "Sagbara", "Tilakwada"],
  "Navsari": ["Chikhli", "Gandevi", "Jalalpore", "Khergam", "Navsari", "Vansda"],
  "Panchmahal": ["Ghogha", "Goghamba", "Halol", "Jambughoda", "Kalol", "Morwa Hadaf", "Shehera"],
  "Patan": ["Chanasma", "Harij", "Radhanpur", "Sami", "Santalpur", "Sarasvati", "Sidhpur"],
  "Porbandar": ["Kutiyana", "Porbandar", "Ranavav"],
  "Rajkot": ["Dhoraji", "Gondal", "Jam Kandorna", "Jasdan", "Jetpur", "Kotada Sangani", "Lodhika", "Paddhari", "Rajkot", "Upleta", "Vinchhiya"],
  "Sabarkantha": ["Himatnagar", "Idar", "Khedbrahma", "Poshina", "Prantij", "Talod", "Vadali", "Vijaynagar"],
  "Surat": ["Bardoli", "Choryasi", "Kamrej", "Mahuva", "Mandvi", "Mangrol", "Olpad", "Palsana", "Surat City", "Umarpada"],
  "Surendranagar": ["Chotila", "Chuda", "Dasada", "Dhrangadhra", "Lakhtar", "Limbdi", "Muli", "Sayla", "Thangadh", "Wadhwan"],
  "Tapi": ["Nizar", "Songadh", "Uchhal", "Valod", "Vyara", "Kukurmunda"],
  "Vadodara": ["Dabhoi", "Desar", "Karjan", "Padra", "Savli", "Sinor", "Vadodara City", "Vadodara Rural", "Vaghodia"],
  "Valsad": ["Dharampur", "Kaprada", "Pardi", "Umbergaon", "Valsad", "Vapi"],
};

export const GUJARAT_DISTRICTS = Object.keys(GUJARAT_DISTRICTS_AND_TALUKAS).sort();

/**
 * Returns an array of sorted talukas for a given district.
 * If district is invalid or empty, returns an empty array.
 */
export function getTalukasForDistrict(district: string | null | undefined): string[] {
  if (!district || !GUJARAT_DISTRICTS_AND_TALUKAS[district]) {
    return [];
  }
  return [...GUJARAT_DISTRICTS_AND_TALUKAS[district]].sort();
}
