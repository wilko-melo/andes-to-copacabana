// Extra hostels added at runtime, and the curated "worth a detour" list.
const EXTRA_HOSTELS={
 cartagena:[{n:"Casa en el Agua (Islas de San Bernardo)",v:"chill",area:"2 h by boat from Cartagena / Tolú",price:"$$$",f:["beach","hammocks","bar","dinner"],gem:true,t:"A hostel on stilts in the open sea. Plankton at night, hammocks over the water, all meals; 1–2 nights, book weeks ahead."}],
 quilotoa:[{n:"Black Sheep Inn (Chugchilán)",v:"eco",area:"Chugchilán",price:"$$$",f:["dinner","view","hottub","quiet"],gem:true,t:"Award-winning eco-lodge with composting loos, a hot tub over the canyon and vegetarian dinners. Full board."}],
 puertolopez:[{n:"Hostería Mandála",v:"chill",area:"North beach",price:"$$",f:["garden","beach","quiet","breakfast"],gem:true,t:"Cabins in a jungle garden right on the beach, run by a Swiss-Italian couple for 20 years."}],
 titicaca:[{n:"Hostal Inti Kala (Isla del Sol)",v:"chill",area:"Isla del Sol south",price:"$",f:["view","quiet","breakfast"],gem:true,verify:true,t:"Simple rooms with the whole lake in front of the window; sunrise from bed."}],
 mancora:[{n:"Kimbas Bungalows",v:"chill",area:"South beach",price:"$$",f:["pool","garden","beach","quiet"],gem:true,t:"Bamboo bungalows in a garden with a pool, five minutes from the noise. The quiet Máncora."}],
};
// {stop, hostel (name as in data), why}
const DETOURS=[
 {stop:"quilotoa",h:"Llullu Llama (Isinliví)",why:"Wood-fired hot tub, three-course dinner and llamas in a village of 200 people. Most people's favourite night in Ecuador."},
 {stop:"vilcabamba",h:"Hostería Izhcayluma",why:"Pool, yoga deck and trail maps in a valley nobody planned to visit. Easy to lose a week."},
 {stop:"cotopaxi",h:"Secret Garden Cotopaxi",why:"Hot tub with a 5,900 m volcano in the window, all meals, hikes from the door."},
 {stop:"quilotoa",h:"Black Sheep Inn (Chugchilán)",why:"The original Andean eco-lodge: canyon-edge hot tub, composting loos, silence."},
 {stop:"huaraz",h:"The Lazy Dog Inn",why:"Canadian-run lodge at 3,600 m above Huaraz; acclimatise with day hikes and a wood stove."},
 {stop:"chachapoyas",h:"Gocta Natura Reserve",why:"Cabins facing one of the tallest waterfalls in the world, and almost no other tourists."},
 {stop:"cartagena",h:"Casa en el Agua (Islas de San Bernardo)",why:"A hostel on stilts in the Caribbean. Jump in from the deck, glowing plankton at night."},
 {stop:"minca",h:"Casa Elemento",why:"The world's biggest hammock hanging over the Sierra Nevada, mototaxi up a dirt road."},
 {stop:"jardin",h:"Kantarrana Hostel",why:"Riverside cabins in the prettiest pueblo in Antioquia, with a cock-of-the-rock reserve next door."},
 {stop:"salento",h:"La Serrana Eco Farm",why:"Farm hostel with hammocks over the coffee valley, 15 minutes' walk from town."},
 {stop:"nuqui",h:"El Cantil Ecolodge",why:"Cabins on a black-sand beach where the jungle meets the Pacific; whales breach in front of breakfast."},
 {stop:"cabodelavela",h:"Rancherías in Cabo de la Vela",why:"Sleep in a Wayuu chinchorro hammock by the sea at the top of the continent, for $5."},
 {stop:"rupununi",h:"Surama Eco-Lodge",why:"Community-owned Makushi lodge in the savannah, canopy walkway an hour away."},
 {stop:"iwokrama",h:"Atta Rainforest Lodge",why:"Eight rooms at the foot of a 30 m canopy walkway in a million acres of forest."},
 {stop:"uppersuriname",h:"Awarradam Jungle Lodge",why:"Hammock verandas above the rapids of the Gran Rio, Saramaccan villages by canoe."},
 {stop:"cayenne",h:"Auberge des Îles du Salut",why:"Sleep in the old prison officers' quarters on Papillon's island."},
 {stop:"alterdochao",h:"Pousada Tupaiú",why:"Garden pousada steps from white river beaches in the middle of the Amazon."},
 {stop:"lencois",h:"Bicho Grilo Hostel (Atins)",why:"Sand-street village at the edge of the dunes; walk into the lagoons at sunrise."},
 {stop:"samaipata",h:"El Jardín Hostel",why:"Garden cabins and a fire pit in Bolivia's hippie hill village, far from the altiplano crowds."},
 {stop:"rurrenabaque",h:"Madidi Jungle Ecolodge",why:"Community-run lodge three hours upriver into one of the most biodiverse parks on earth."},
 {stop:"ilhagrande",h:"Biergarten Hostel",why:"Own microbrewery on a car-free jungle island, three hours from Rio."},
 {stop:"mancora",h:"Kimbas Bungalows",why:"Bamboo bungalows and a pool five minutes from Máncora's party strip, none of the noise."},
];
