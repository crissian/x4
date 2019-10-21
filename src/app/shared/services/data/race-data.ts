/* tslint:disable:max-line-length */
const entities = {
   argon: {
      id: 'argon',
      name: 'Argon',
      description: 'The descendents of Terran colonists stranded from Earth centuries ago, the Argon became their own thriving civilisation covering a great many systems and forging relations with several alien races. Throughout their short history the Argon Federation has been plagued by war, notably with the Xenon. Their greatest challenge however came from the unlikely source of the reconnected Terrans of Earth where they were plunged into the costly Terran Conflict.',
      icon: 'race_argon',
   },
   boron: {
      id: 'boron',
      name: 'Boron',
      description: 'The predominantly peaceful Boron are aquatic life-forms from the planet Nishala. While initially pacifist, the discovery of their world by the Split forced them to invent defences and adapt to war. Enjoying a close relationship with the Argon, the Boron remain a wise and measured people.',
      icon: 'race_boron',
   },
   drone: {
      id: 'drone',
      name: 'Drone',
      description: 'Drones are designed to specialise in a narrow field of tasks. With AI research outlawed to avoid a similar situation to the Terraformer-Xenon evolution, drones are limited in scope and capability. However, results from Xenon research have led to advancements in drone technology, something which troubled many experts.',
   },
   khaak: {
      id: 'khaak',
      name: 'Kha\'ak',
      description: 'Thought to have been wiped out during Operation Final Fury, very little is known about the Kha\'ak other than they seem to be an insectile hive race hell-bent on the destruction of all those that share the Jump Gate network. As a hive race, it is suspected that individual intelligence gives way to a communal or caste mentality, but very little research into the species was completed before Operation Final Fury took place.',
      icon: 'race_khaak',
   },
   paranid: {
      id: 'paranid',
      name: 'Paranid',
      description: 'The physically imposing Paranid are often regarded as arrogant by several races which usually stems from their exceptional mathematic skills and religious fervour. Allied with the Split and distrusting of the Argon, the Paranid have been in several conflicts where they use their technological prowess and multilevel thinking to gain tactical advantages.',
      icon: 'race_paranid',
   },
   split: {
      id: 'split',
      name: 'Split',
      description: 'The aggressive Split live in a society constantly changing leadership where challenging factions rise up to impose a new Patriarch. Their short temper and fiery disposition puts them at odds with other races which has sometimes lead to war, notably with the Boron and Argon.',
      icon: 'race_split',
   },
   teladi: {
      id: 'teladi',
      name: 'Teladi',
      description: 'The lizard-like Teladi are one of the founding members of the Community of Planets and have a natural affinity towards business and the accumulation of profit. They enjoy favourable relations with other races although some find their drive for profit disconcerting. Their long lifespan gives them a unique view of the Jump Gate shutdown, as does their previous experience being cut off from their home system of Ianamus Zura.',
      icon: 'race_teladi',
   },
   terran: {
      id: 'terran',
      name: 'Terran',
      description: 'The Terrans of the Solar System have a long history of spaceflight and exploring the Jump Gate network. After the events of the Terraformers over Earth, the Terrans severed their contact with the rest of the galaxy and had several centuries of rebuilding and advancement in isolation. Their brief return led to the Terran Conflict which preceded the mass disconnection of Jump Gates. It is unknown if the war precipitated this event.',
      icon: 'race_terran',
   },
   xenon: {
      id: 'xenon',
      name: 'Xenon',
      description: 'The Xenon are a mechanical race resulting from past Terran terraformer ships which eventually evolved intelligence. A constant threat in many areas of the galaxy, it is thought that the Jump Gate shutdown may stem their movements but given their disregard of time it is possible they may simply travel between stars. The Xenon have no known allies and communication with them is often relegated to folklore.',
      icon: 'race_xenon',
   },
};

export const Races = {
   ...entities,
   all: [
      entities.argon,
      entities.boron,
      entities.drone,
      entities.khaak,
      entities.paranid,
      entities.split,
      entities.teladi,
      entities.terran,
      entities.xenon,
   ]
};
