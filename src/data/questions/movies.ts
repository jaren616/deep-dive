import type { QuestionDef } from '../../types';

export const movies: QuestionDef[] = [
  {
    id: 'mov-pixar',
    theme: 'movies',
    prompt: 'Name a Pixar feature film',
    answers: {
      plankton: ['Toy Story', 'Finding Nemo', 'Cars', 'Monsters, Inc.|Monsters Inc'],
      shrimp: ['The Incredibles|Incredibles', 'Up', 'Inside Out', 'Coco', 'WALL-E|Wall E', 'Ratatouille', 'Toy Story 2', 'Toy Story 3', 'A Bug\'s Life|Bugs Life'],
      jellyfish: ['Finding Dory', 'Monsters University', 'Brave', 'Cars 2', 'Cars 3', 'Incredibles 2', 'Toy Story 4', 'Inside Out 2', 'Soul', 'Luca', 'Turning Red', 'Elemental'],
      octopus: ['Onward', 'The Good Dinosaur|Good Dinosaur', 'Lightyear', 'Elio'],
    },
  },
  {
    id: 'mov-bond-actor',
    theme: 'movies',
    prompt: 'Name an actor who has played James Bond in an Eon film',
    answers: {
      plankton: ['Daniel Craig|Craig', 'Sean Connery|Connery'],
      shrimp: ['Pierce Brosnan|Brosnan', 'Roger Moore|Moore'],
      octopus: ['Timothy Dalton|Dalton'],
      anglerfish: ['George Lazenby|Lazenby'],
    },
  },
  {
    id: 'mov-marvel-hero',
    theme: 'movies',
    prompt: 'Name a Marvel superhero',
    hint: 'Hero name or alter ego',
    open: true,
    answers: {
      plankton: ['Spider-Man|Spiderman|Peter Parker', 'Iron Man|Tony Stark', 'Captain America|Steve Rogers', 'Hulk|Bruce Banner|The Hulk', 'Thor'],
      shrimp: ['Black Panther|T\'Challa', 'Black Widow|Natasha Romanoff', 'Wolverine|Logan', 'Deadpool', 'Doctor Strange|Dr Strange|Stephen Strange', 'Captain Marvel|Carol Danvers', 'Ant-Man|Ant Man|Scott Lang', 'Hawkeye|Clint Barton'],
      jellyfish: ['Scarlet Witch|Wanda Maximoff|Wanda', 'Vision', 'Star-Lord|Star Lord|Peter Quill', 'Groot', 'Rocket|Rocket Raccoon', 'Gamora', 'Drax', 'Falcon|Sam Wilson', 'Winter Soldier|Bucky Barnes|Bucky', 'Daredevil|Matt Murdock', 'Storm', 'Cyclops', 'Jean Grey|Phoenix', 'Professor X|Charles Xavier', 'Wasp|Hope van Dyne', 'Shang-Chi', 'Ms. Marvel|Ms Marvel|Kamala Khan', 'She-Hulk|Jennifer Walters', 'Moon Knight', 'War Machine|James Rhodes|Rhodey', 'Mantis', 'Nebula'],
      octopus: ['Silver Surfer', 'Mister Fantastic|Mr Fantastic|Reed Richards', 'Invisible Woman|Sue Storm', 'Human Torch|Johnny Storm', 'The Thing|Thing|Ben Grimm', 'Luke Cage', 'Jessica Jones', 'Iron Fist|Danny Rand', 'Punisher|Frank Castle', 'Ghost Rider', 'Blade', 'Nightcrawler', 'Rogue', 'Gambit', 'Beast', 'Iceman', 'Colossus', 'Kitty Pryde|Shadowcat', 'Jubilee', 'Psylocke', 'Cable', 'Domino', 'Spider-Woman', 'Spider-Gwen|Ghost-Spider|Gwen Stacy', 'Miles Morales', 'Squirrel Girl', 'Nova', 'Adam Warlock', 'Yelena Belova', 'Kate Bishop', 'America Chavez', 'Echo', 'Okoye', 'Shuri', 'Valkyrie', 'Sersi', 'Ikaris', 'Kang'],
      anglerfish: ['Quasar', 'Sentry', 'Black Bolt', 'Medusa', 'Namor', 'Moondragon', 'Hercules', 'Wonder Man', 'Tigra', 'Hellcat', 'Dazzler', 'Cloak', 'Dagger', 'Power Man', 'Darkhawk', 'Sleepwalker', 'Speedball', 'Moon Girl', 'Devil Dinosaur', 'X-23|Laura Kinney', 'Banshee', 'Havok', 'Polaris', 'Northstar', 'Forge', 'Bishop', 'Magik', 'Wolfsbane', 'Cannonball', 'Sunspot', 'Mirage', 'Warlock', 'Multiple Man|Jamie Madrox', 'Longshot', 'Captain Britain', 'Union Jack', 'Black Knight', 'Elsa Bloodstone', 'Man-Thing', 'Werewolf by Night', 'Howard the Duck'],
    },
  },
  {
    id: 'mov-best-picture',
    theme: 'movies',
    prompt: 'Name a film that won the Oscar for Best Picture',
    answers: {
      plankton: ['Titanic', 'The Godfather|Godfather', 'Oppenheimer'],
      shrimp: ['Forrest Gump', 'Gladiator', 'Parasite', 'The Lord of the Rings: The Return of the King|Return of the King', 'Schindler\'s List', 'The Silence of the Lambs|Silence of the Lambs', 'Everything Everywhere All at Once'],
      jellyfish: ['Braveheart', 'Casablanca', 'Gone with the Wind', 'Rocky', 'The Departed', 'Slumdog Millionaire', 'The King\'s Speech', 'Argo', '12 Years a Slave|Twelve Years a Slave', 'Birdman', 'Moonlight', 'The Shape of Water|Shape of Water', 'Green Book', 'Nomadland', 'CODA', 'Anora', 'The Sound of Music|Sound of Music', 'Ben-Hur|Ben Hur', 'The Godfather Part II|Godfather Part 2|Godfather II', 'One Flew Over the Cuckoo\'s Nest', 'American Beauty', 'Chicago', 'No Country for Old Men'],
      octopus: ['The Artist', 'Spotlight', 'Million Dollar Baby', 'Crash', 'The Hurt Locker|Hurt Locker', 'A Beautiful Mind|Beautiful Mind', 'Shakespeare in Love', 'The English Patient|English Patient', 'Unforgiven', 'Dances with Wolves', 'Driving Miss Daisy', 'Rain Man', 'The Last Emperor', 'Platoon', 'Out of Africa', 'Amadeus', 'Terms of Endearment', 'Gandhi', 'Chariots of Fire', 'Ordinary People', 'Kramer vs. Kramer|Kramer vs Kramer', 'The Deer Hunter', 'Annie Hall', 'The Sting', 'The French Connection', 'Patton', 'Midnight Cowboy', 'West Side Story', 'Lawrence of Arabia', 'My Fair Lady', 'The Apartment', 'On the Waterfront', 'From Here to Eternity', 'All About Eve', 'Mrs. Miniver|Mrs Miniver', 'Rebecca', 'It Happened One Night', 'Wings', 'Oliver!|Oliver', 'Tom Jones', 'An American in Paris', 'Around the World in 80 Days', 'The Bridge on the River Kwai|Bridge on the River Kwai', 'Gigi', 'The Best Years of Our Lives'],
      anglerfish: ['Cavalcade', 'Grand Hotel', 'Cimarron', 'All Quiet on the Western Front', 'The Broadway Melody', 'Mutiny on the Bounty', 'The Great Ziegfeld', 'The Life of Emile Zola', 'You Can\'t Take It with You', 'How Green Was My Valley', 'Going My Way', 'The Lost Weekend', 'Gentleman\'s Agreement', 'Hamlet', 'All the King\'s Men', 'The Greatest Show on Earth', 'Marty', 'A Man for All Seasons', 'In the Heat of the Night'],
    },
  },
  {
    id: 'mov-disney-princess',
    theme: 'movies',
    prompt: 'Name a Disney Princess',
    hint: 'From the official Disney Princess line-up',
    answers: {
      plankton: ['Cinderella', 'Snow White', 'Ariel', 'Belle'],
      shrimp: ['Jasmine', 'Aurora|Sleeping Beauty', 'Rapunzel', 'Moana', 'Mulan'],
      jellyfish: ['Pocahontas', 'Tiana', 'Merida'],
      octopus: ['Raya'],
    },
  },
  {
    id: 'mov-friends',
    theme: 'movies',
    prompt: 'Name a main character from Friends',
    hint: 'First name is fine',
    answers: {
      plankton: ['Rachel Green|Rachel', 'Ross Geller|Ross', 'Joey Tribbiani|Joey', 'Chandler Bing|Chandler'],
      shrimp: ['Monica Geller|Monica', 'Phoebe Buffay|Phoebe'],
    },
  },
  {
    id: 'mov-harry-potter',
    theme: 'movies',
    prompt: 'Name a Hogwarts teacher from Harry Potter',
    hint: 'Surname or full name',
    answers: {
      plankton: ['Albus Dumbledore|Dumbledore', 'Severus Snape|Snape', 'Minerva McGonagall|McGonagall'],
      shrimp: ['Remus Lupin|Lupin', 'Rubeus Hagrid|Hagrid', 'Gilderoy Lockhart|Lockhart', 'Dolores Umbridge|Umbridge', 'Quirinus Quirrell|Quirrell'],
      jellyfish: ['Filius Flitwick|Flitwick', 'Pomona Sprout|Sprout', 'Sybill Trelawney|Trelawney', 'Horace Slughorn|Slughorn', 'Alastor Moody|Mad-Eye Moody|Moody', 'Barty Crouch Jr|Barty Crouch Junior'],
      octopus: ['Rolanda Hooch|Madam Hooch|Hooch', 'Firenze', 'Cuthbert Binns|Professor Binns|Binns', 'Poppy Pomfrey|Madam Pomfrey', 'Amycus Carrow', 'Alecto Carrow'],
      anglerfish: ['Aurora Sinistra|Sinistra', 'Septima Vector|Vector', 'Charity Burbage|Burbage', 'Wilhelmina Grubbly-Plank|Grubbly-Plank', 'Bathsheda Babbling|Babbling', 'Silvanus Kettleburn|Kettleburn'],
    },
  },
  {
    id: 'mov-star-wars',
    theme: 'movies',
    prompt: 'Name a Star Wars character',
    open: true,
    answers: {
      plankton: ['Darth Vader|Vader|Anakin Skywalker|Anakin', 'Luke Skywalker|Luke', 'Yoda', 'Han Solo|Han', 'Princess Leia|Leia|Leia Organa'],
      shrimp: ['Chewbacca|Chewie', 'R2-D2|R2D2', 'C-3PO|C3PO', 'Obi-Wan Kenobi|Obi-Wan|Obi Wan|Ben Kenobi', 'Darth Maul|Maul', 'Emperor Palpatine|Palpatine|Darth Sidious|The Emperor', 'Boba Fett', 'Jabba the Hutt|Jabba', 'Grogu|Baby Yoda', 'Rey', 'Kylo Ren|Ben Solo'],
      jellyfish: ['Padme Amidala|Padmé|Padme', 'Qui-Gon Jinn|Qui-Gon', 'Mace Windu', 'Count Dooku|Dooku', 'General Grievous|Grievous', 'Jar Jar Binks|Jar Jar', 'Lando Calrissian|Lando', 'Finn', 'Poe Dameron|Poe', 'BB-8|BB8', 'Ahsoka Tano|Ahsoka', 'The Mandalorian|Din Djarin|Mando', 'Jango Fett', 'Ewoks|Wicket', 'Stormtrooper', 'Admiral Ackbar|Ackbar', 'Grand Moff Tarkin|Tarkin'],
      octopus: ['Cassian Andor|Andor', 'Jyn Erso', 'K-2SO', 'Rose Tico', 'Captain Phasma|Phasma', 'Supreme Leader Snoke|Snoke', 'General Hux|Hux', 'Bodhi Rook', 'Chirrut Imwe', 'Saw Gerrera', 'Orson Krennic|Krennic', 'Moff Gideon', 'Greef Karga', 'Cara Dune', 'Bo-Katan', 'Fennec Shand', 'Cad Bane', 'Asajj Ventress|Ventress', 'Kit Fisto', 'Plo Koon', 'Ki-Adi-Mundi', 'Shaak Ti', 'Aayla Secura', 'Wedge Antilles|Wedge', 'Biggs Darklighter', 'Nien Nunb', 'Greedo', 'Watto', 'Sebulba', 'Shmi Skywalker', 'Owen Lars|Uncle Owen', 'Beru Lars|Aunt Beru', 'Bail Organa', 'Mon Mothma', 'Maz Kanata', 'Lor San Tekka', 'Thrawn|Grand Admiral Thrawn', 'Ezra Bridger', 'Kanan Jarrus', 'Hera Syndulla', 'Sabine Wren', 'Zeb', 'Chopper', 'Captain Rex|Rex', 'Cal Kestis', 'Dryden Vos', 'Qi\'ra', 'Tobias Beckett', 'Enfys Nest', 'L3-37', 'Savage Opress', 'Mother Talzin'],
      anglerfish: ['Salacious Crumb', 'Bib Fortuna', 'Max Rebo', 'Sy Snootles', 'Oola', 'Rancor', 'Ponda Baba', 'Dr. Evazan|Evazan', 'Figrin D\'an', 'Porkins', 'Dak Ralter', 'Zev Senesca', 'Bossk', 'IG-88', 'Dengar', '4-LOM', 'Zuckuss', 'Lobot', 'Ugnaught', 'Dexter Jettster', 'Lama Su', 'Taun We', 'Zam Wesell', 'Wat Tambor', 'Nute Gunray', 'Rune Haako', 'Boss Nass', 'Captain Panaka', 'Sio Bibble', 'Yaddle', 'Even Piell', 'Saesee Tiin', 'Eeth Koth', 'Depa Billaba', 'Oppo Rancisis', 'Agen Kolar', 'Luminara Unduli', 'Barriss Offee', 'Cin Drallig', 'Unkar Plutt', 'Teedo', 'Babu Frik', 'Zorii Bliss', 'Jannah', 'Vice Admiral Holdo|Holdo', 'DJ', 'Paige Tico', 'Moloch', 'Rio Durant', 'Val', 'Luthen Rael', 'Dedra Meero', 'Syril Karn', 'Kino Loy', 'Maarva Andor', 'Bix Caleen', 'Vel Sartha', 'Cinta Kaz', 'Baylan Skoll', 'Shin Hati', 'Morgan Elsbeth', 'Huyang', 'Omega', 'Hunter', 'Wrecker', 'Tech', 'Echo', 'Crosshair', 'Fives', 'Hevy', 'Cut Lawquane', 'Hondo Ohnaka', 'Pre Vizsla', 'Satine Kryze'],
    },
  },
];
