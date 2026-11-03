import type { QuestionDef } from '../../types';

export const brands: QuestionDef[] = [
  {
    id: 'bra-car-brand',
    theme: 'brands',
    prompt: 'Name a car manufacturer',
    hint: 'Current or historic marques',
    open: true,
    answers: {
      plankton: ['Ford', 'BMW', 'Toyota', 'Mercedes-Benz|Mercedes', 'Audi', 'Tesla'],
      shrimp: ['Volkswagen|VW', 'Honda', 'Ferrari', 'Lamborghini', 'Porsche', 'Nissan', 'Kia', 'Hyundai', 'Vauxhall', 'Jaguar', 'Land Rover|Range Rover', 'Rolls-Royce|Rolls Royce', 'Bentley', 'Mini', 'Fiat', 'Peugeot', 'Renault', 'Volvo', 'Chevrolet|Chevy', 'Aston Martin', 'McLaren', 'Bugatti', 'Mazda', 'Skoda|Škoda', 'Seat|SEAT', 'Citroen|Citroën'],
      jellyfish: ['Maserati', 'Alfa Romeo', 'Lotus', 'Subaru', 'Mitsubishi', 'Suzuki', 'Lexus', 'Dacia', 'Jeep', 'Dodge', 'Cadillac', 'Lincoln', 'Chrysler', 'Buick', 'GMC', 'Infiniti', 'Acura', 'Genesis', 'Cupra', 'MG', 'BYD', 'Polestar', 'Smart', 'DS', 'Opel', 'Lancia', 'Pagani', 'Koenigsegg', 'Rivian', 'Lucid', 'Morgan', 'TVR', 'Rover', 'Saab', 'Daewoo', 'Hummer', 'Pontiac', 'Plymouth', 'Daihatsu', 'Isuzu', 'Tata', 'Mahindra', 'Proton', 'Ssangyong|KGM', 'Alpine', 'Abarth', 'Ram', 'Geely', 'Nio', 'Xpeng', 'Chery', 'Great Wall', 'Ineos', 'Lada', 'Trabant', 'Austin', 'Triumph', 'Reliant', 'Delorean|DeLorean'],
      octopus: ['Hillman', 'Humber', 'Sunbeam', 'Wolseley', 'Riley', 'Morris', 'Standard', 'Singer', 'Talbot', 'Simca', 'Panhard', 'Hispano-Suiza', 'Isotta Fraschini', 'Lagonda', 'Bristol', 'Jensen', 'AC|AC Cars', 'Caterham', 'Ariel', 'Noble', 'Ginetta', 'Radical', 'Marcos', 'Gordon-Murray|Gordon Murray Automotive|GMA', 'Spyker', 'Donkervoort', 'Wiesmann', 'Gumpert|Apollo', 'Artega', 'Borgward', 'Wartburg', 'Moskvitch', 'Volga|GAZ', 'UAZ', 'ZiL|ZIL', 'Tatra', 'Zastava|Yugo', 'FSO', 'Polski Fiat', 'Studebaker', 'Packard', 'Hudson', 'Nash', 'AMC', 'Edsel', 'Oldsmobile', 'Mercury', 'Saturn', 'Scion', 'Datsun', 'Hino', 'Holden', 'HSV', 'Tucker', 'Duesenberg', 'Cord', 'Auburn', 'Pierce-Arrow', 'Stutz', 'Fisker', 'Karma', 'Vinfast|VinFast', 'Togg', 'Rimac', 'Pininfarina|Automobili Pininfarina', 'Hongqi', 'Zeekr', 'Li Auto', 'Leapmotor', 'Aiways', 'Lynk & Co|Lynk and Co', 'Wuling', 'Haval', 'Ora', 'Omoda', 'Jaecoo', 'Xiaomi', 'De Tomaso', 'Iso', 'Bizzarrini', 'Cizeta', 'Vector', 'Saleen', 'SSC', 'Hennessey', 'Panoz', 'Mosler', 'Shelby', 'Callaway', 'Lister', 'Vanden Plas', 'Bond', 'Peel', 'Messerschmitt', 'Heinkel', 'Isetta', 'NSU', 'Auto Union', 'DKW', 'Horch', 'Wanderer', 'Maybach', 'Glas', 'Hanomag', 'Matra', 'Facel Vega', 'Venturi', 'Delahaye', 'Delage', 'Talbot-Lago', 'Amilcar', 'Salmson', 'Hotchkiss'],
    },
  },
  {
    id: 'bra-fast-food',
    theme: 'brands',
    prompt: 'Name a fast food chain',
    open: true,
    answers: {
      plankton: ['McDonald\'s|McDonalds|Maccies|Maccas', 'Burger King', 'KFC|Kentucky Fried Chicken', 'Subway'],
      shrimp: ['Domino\'s|Dominos|Domino\'s Pizza', 'Pizza Hut', 'Taco Bell', 'Greggs', 'Five Guys', 'Wendy\'s|Wendys', 'Nando\'s|Nandos', 'Starbucks', 'Chick-fil-A|Chick fil A', 'Popeyes'],
      jellyfish: ['Papa John\'s|Papa Johns', 'Leon', 'Wimpy', 'Shake Shack', 'In-N-Out|In N Out|In-N-Out Burger', 'Chipotle', 'Wingstop', 'Costa|Costa Coffee', 'Pret|Pret A Manger', 'Tim Hortons', 'Dunkin\'|Dunkin|Dunkin Donuts', 'Krispy Kreme', 'Arby\'s|Arbys', 'Sonic|Sonic Drive-In', 'Jack in the Box', 'Carl\'s Jr.|Carls Jr', 'Hardee\'s|Hardees', 'Whataburger', 'Dairy Queen|DQ', 'Little Caesars', 'Panda Express', 'Wagamama', 'Itsu', 'Wasabi', 'Tortilla', 'German Doner Kebab|GDK', 'Chicken Cottage', 'Morley\'s|Morleys', 'Dixy Chicken|Dixy', 'Harvester', 'Frankie & Benny\'s', 'Pizza Express', 'Wetherspoons|Spoons', 'Burger & Lobster', 'Byron', 'Honest Burgers'],
      octopus: ['Jollibee', 'Bojangles', 'Raising Cane\'s|Raising Canes', 'Zaxby\'s|Zaxbys', 'Culver\'s|Culvers', 'Steak \'n Shake|Steak n Shake', 'White Castle', 'Checkers', 'Rally\'s', 'Del Taco', 'Qdoba', 'Moe\'s', 'Baja Fresh', 'El Pollo Loco', 'Church\'s Chicken|Churchs', 'Long John Silver\'s', 'Captain D\'s', 'Panera|Panera Bread', 'Jimmy John\'s', 'Jersey Mike\'s', 'Firehouse Subs', 'Quiznos', 'Potbelly', 'Sbarro', 'Papa Murphy\'s', 'Marco\'s Pizza', 'Hungry Jack\'s|Hungry Jacks', 'Red Rooster', 'Oporto', 'Guzman y Gomez', 'Mary Brown\'s', 'Harvey\'s', 'A&W', 'Lotteria', 'MOS Burger|Mos Burger', 'Yoshinoya', 'Sukiya', 'CoCo Ichibanya', 'Max Burgers|Max', 'Quick', 'Telepizza', 'Pollo Campero', 'Chicken Licken', 'Steers', 'Galito\'s', 'Barburrito', 'Chopstix', 'Pollo Tropical', 'Biryani by Kilo', 'Haldiram\'s', 'Saravana Bhavan'],
    },
  },
  {
    id: 'bra-tech-company',
    theme: 'brands',
    prompt: 'Name a smartphone brand',
    open: true,
    answers: {
      plankton: ['Apple|iPhone', 'Samsung'],
      shrimp: ['Google|Pixel|Google Pixel', 'Huawei', 'Xiaomi', 'OnePlus', 'Nokia', 'Motorola', 'Sony|Sony Xperia|Xperia'],
      jellyfish: ['Oppo', 'Vivo', 'Honor', 'Realme', 'Nothing', 'LG', 'BlackBerry', 'HTC', 'Asus|ROG Phone', 'Alcatel', 'Doro', 'Fairphone', 'Poco', 'Redmi', 'Tecno', 'Infinix', 'ZTE', 'Lenovo'],
      octopus: ['Itel', 'iQOO', 'Meizu', 'TCL', 'Sharp', 'Kyocera', 'Panasonic', 'Palm', 'Siemens', 'Ericsson|Sony Ericsson', 'Sagem', 'Vertu', 'CAT|Cat phones', 'Ulefone', 'Doogee', 'Oukitel', 'Blackview', 'Wiko', 'BLU', 'Micromax', 'Lava', 'Karbonn', 'Coolpad', 'Gionee', 'Lenovo Legion', 'Nubia', 'Red Magic|RedMagic', 'Black Shark', 'Essential', 'Light', 'Punkt', 'Teracube', 'Shift', 'Volla', 'Pine64|PinePhone', 'Librem|Purism', 'Light Phone', 'Hammer', 'Energizer', 'Crosscall', 'Sonim', 'Kyocera DuraForce', 'Benco', 'Symphony', 'Walton', 'QMobile', 'Cherry Mobile', 'Myphone', 'Evercoss', 'Advan', 'Polytron', 'Mobicel', 'Condor', 'Wileyfox', 'BQ', 'Gigaset', 'Emporia', 'Neffos', 'Elephone', 'Cubot', 'Umidigi', 'Leagoo', 'Hisense', 'Meitu', 'Smartisan', 'LeEco', 'Vodafone Smart'],
    },
  },
  {
    id: 'bra-chocolate',
    theme: 'brands',
    prompt: 'Name a chocolate bar',
    hint: 'A branded bar sold in shops',
    open: true,
    answers: {
      plankton: ['Mars|Mars Bar', 'Snickers', 'KitKat|Kit Kat', 'Twix', 'Dairy Milk|Cadbury Dairy Milk'],
      shrimp: ['Galaxy', 'Bounty', 'Milky Way', 'Twirl', 'Flake', 'Crunchie', 'Wispa', 'Toblerone', 'Aero', 'Yorkie', 'Lion|Lion Bar', 'Double Decker', 'Boost', 'Fudge|Freddo', 'Caramac', 'Starbar|Star Bar', 'Picnic', 'Topic', 'Twix Xtra'],
      jellyfish: ['Kinder Bueno|Bueno', 'Hershey\'s|Hershey', 'Reese\'s|Reeses', 'Butterfinger', 'Baby Ruth', 'Milkybar', 'Ripple', 'Time Out', 'Drifter', 'Wunderbar', 'Moro', 'Curly Wurly', 'Chomp', 'Caramel|Cadbury Caramel', 'Fruit & Nut|Fruit and Nut', 'Whole Nut', 'Turkish Delight|Fry\'s Turkish Delight', 'Fry\'s Chocolate Cream', 'Galaxy Caramel', 'Ritter Sport', 'Lindt|Lindor', 'Milka', 'Green & Black\'s|Green and Blacks', 'Tony\'s Chocolonely|Tony\'s', 'Kinder', 'Kinder Chocolate', 'Mr Big', 'Breakaway', 'Penguin', 'Club', 'Blue Riband', 'Taxi', 'Rocky', 'Tunnock\'s Caramel Wafer|Tunnocks', 'Toffee Crisp', 'Munchies', 'Rolo', 'Smarties', 'Maltesers', 'M&M\'s|M&Ms|Minstrels', 'Revels', 'Buttons|Giant Buttons', 'Dairy Milk Buttons', 'Heroes', 'Celebrations', 'Quality Street', 'Roses', 'Ferrero Rocher', 'Terry\'s Chocolate Orange|Chocolate Orange', 'Mint Aero', 'After Eight', 'Matchmakers', 'Poppets'],
      octopus: ['Payday', 'Almond Joy', 'Mounds', 'Heath', 'Skor', '3 Musketeers|Three Musketeers', '100 Grand', 'Oh Henry!|Oh Henry', 'Mr. Goodbar|Mr Goodbar', 'Krackel', 'Whatchamacallit', 'Zero', 'Coffee Crisp', 'Crispy Crunch', 'Caramilk', 'Glosette', 'Jersey Caramel', 'Cherry Ripe', 'Violet Crumble', 'Polly Waffle', 'Pinky', 'Perky Nana', 'Chokito', 'Ferrero', 'Duplo', 'Hanuta', 'Yogurette', 'Knoppers', 'Balisto', 'Corny', 'Mars Planets', 'Galaxy Ripple'],
    },
  },
  {
    id: 'bra-sportswear',
    theme: 'brands',
    prompt: 'Name a sportswear brand',
    open: true,
    answers: {
      plankton: ['Nike', 'Adidas'],
      shrimp: ['Puma', 'Under Armour', 'Reebok', 'New Balance', 'Asics', 'Converse', 'Vans', 'Umbro', 'Lululemon', 'Fila', 'Jordan|Air Jordan', 'Gymshark', 'The North Face|North Face'],
      jellyfish: ['Kappa', 'Lonsdale', 'Slazenger', 'Ellesse', 'Champion', 'Le Coq Sportif', 'Hummel', 'Mizuno', 'Diadora', 'Lotto', 'Joma', 'Errea|Erreà', 'Macron', 'Canterbury', 'Kukri', 'Hoka|Hoka One One', 'On|On Running|On Cloud', 'Saucony', 'Brooks', 'Salomon', 'Columbia', 'Patagonia', 'Berghaus', 'Karrimor', 'Speedo', 'Arena', 'Oakley', 'Castore', 'Sergio Tacchini', 'Admiral', 'Le Tigre', 'Fred Perry', 'Lacoste', 'Ralph Lauren|Polo', 'Kswiss|K-Swiss', 'Gola', 'Mitre', 'Penalty', 'Topper', 'Li-Ning|Li Ning', 'Anta', 'Xtep', 'Peak', '361 Degrees|361°', 'Decathlon|Kalenji|Kipsta|Domyos', 'Sweaty Betty', 'Alo|Alo Yoga', 'Vuori', 'Athleta', 'Rapha', 'Castelli', 'Assos', 'Endura', 'Dhb', 'Altra', 'Inov-8|Inov8', 'Merrell', 'Skechers', 'Ronhill', 'Montane', 'Rab', 'Arc\'teryx|Arcteryx', 'Mammut', 'Helly Hansen', 'Oneill|O\'Neill', 'Quiksilver', 'Billabong', 'Rip Curl', 'Volcom', 'DC Shoes|DC', 'Etnies', 'Element', 'Spalding', 'Wilson', 'Head', 'Babolat', 'Yonex', 'Dunlop', 'Prince', 'Gray-Nicolls|Gray Nicolls', 'Gunn & Moore|GM', 'Kookaburra', 'Everlast', 'Venum', 'Hayabusa', 'Bauer', 'CCM', 'Warrior', 'STX', 'Rawlings', 'Easton', 'Callaway', 'TaylorMade|Taylormade', 'Titleist', 'Ping', 'FootJoy', 'Cobra', 'Mizuno Golf', 'Sondico', 'Precision', 'Nike SB', 'Starter', 'Russell Athletic'],
    },
  },
  {
    id: 'bra-airline',
    theme: 'brands',
    prompt: 'Name an airline',
    open: true,
    answers: {
      plankton: ['British Airways|BA', 'Ryanair', 'easyJet|Easyjet', 'Emirates'],
      shrimp: ['Virgin Atlantic|Virgin', 'Jet2|Jet2.com', 'Qatar Airways|Qatar', 'Lufthansa', 'Air France', 'KLM', 'American Airlines|American', 'Delta|Delta Air Lines', 'United|United Airlines', 'Wizz Air|Wizz', 'TUI|TUI Airways', 'Singapore Airlines', 'Qantas', 'Etihad'],
      jellyfish: ['Cathay Pacific|Cathay', 'Turkish Airlines', 'Aer Lingus', 'Iberia', 'Swiss|Swiss International Air Lines', 'Southwest|Southwest Airlines', 'JetBlue', 'Air Canada', 'Air India', 'Japan Airlines|JAL', 'ANA|All Nippon Airways', 'Korean Air', 'Air New Zealand', 'Ethiopian Airlines', 'Kenya Airlines|Kenya Airways', 'South African Airways|SAA', 'Virgin Australia', 'Alaska Airlines', 'Spirit|Spirit Airlines', 'Frontier', 'Norwegian|Norwegian Air', 'Vueling', 'Eurowings', 'Loganair', 'Flybe', 'Aeroflot', 'Finnair', 'SAS|Scandinavian Airlines', 'Icelandair', 'TAP|TAP Air Portugal', 'ITA Airways|Alitalia', 'Aegean', 'LOT|LOT Polish Airlines', 'Austrian Airlines|Austrian', 'Brussels Airlines', 'Saudia', 'Gulf Air', 'Oman Air', 'El Al', 'EgyptAir|Egyptair', 'Royal Air Maroc', 'LATAM', 'Avianca', 'Aeromexico|Aeroméxico', 'Copa|Copa Airlines', 'AirAsia', 'Malaysia Airlines', 'Thai Airways|Thai', 'Garuda Indonesia|Garuda', 'Philippine Airlines', 'Cebu Pacific', 'Vietnam Airlines', 'China Airlines', 'EVA Air|EVA', 'Air China', 'China Eastern', 'China Southern', 'Hainan Airlines', 'IndiGo|Indigo', 'SpiceJet', 'Vistara', 'Jetstar', 'Scoot', 'Pegasus', 'flydubai|Fly Dubai', 'Air Arabia', 'Condor', 'Volotea', 'Transavia', 'Air Europa', 'Iberia Express', 'Level', 'Play', 'Discover Airlines', 'Hawaiian Airlines|Hawaiian', 'Allegiant', 'Sun Country', 'Breeze', 'WestJet', 'Porter', 'Air Transat', 'Flair', 'Aerolineas Argentinas|Aerolíneas Argentinas', 'Gol', 'Azul', 'Sky Airline', 'JetSMART', 'Volaris', 'VivaAerobus', 'Interjet', 'Pan Am', 'TWA|Trans World Airlines', 'Monarch', 'Thomas Cook Airlines|Thomas Cook', 'bmi|British Midland', 'Dan-Air', 'British Caledonian', 'Laker Airways|Laker', 'Swissair', 'Sabena', 'Ansett', 'Eastern Air Lines|Eastern', 'Braniff', 'Continental', 'Northwest', 'US Airways', 'Virgin America', 'Air Berlin', 'Germanwings', 'Jet Airways', 'Kingfisher Airlines|Kingfisher', 'Malév|Malev', 'Olympic Airways|Olympic', 'Cyprus Airways', 'Air Malta', 'Croatia Airlines', 'Air Serbia', 'Tarom', 'Bulgaria Air', 'Ukraine International', 'Belavia', 'S7', 'Pobeda', 'Air Astana', 'Uzbekistan Airways', 'Azerbaijan Airlines|AZAL', 'Georgian Airways', 'Air Mauritius', 'Air Seychelles', 'RwandAir', 'Air Tanzania', 'Air Namibia', 'Air Zimbabwe', 'Air Peace', 'Arik Air', 'Air Senegal', 'Air Côte d\'Ivoire|Air Cote d\'Ivoire', 'ASKY', 'Air Algérie|Air Algerie', 'Tunisair', 'Libyan Airlines', 'Middle East Airlines|MEA', 'Royal Jordanian', 'Kuwait Airways', 'Iran Air', 'Mahan Air', 'PIA|Pakistan International Airlines', 'Biman', 'US-Bangla', 'Nepal Airlines', 'Druk Air', 'SriLankan Airlines|SriLankan', 'Maldivian', 'Air Niugini', 'Fiji Airways', 'Air Tahiti Nui', 'Air Vanuatu', 'Solomon Airlines', 'Aircalin', 'Air Kiribati', 'Nauru Airlines', 'Rex', 'Bonza', 'Air North', 'Canadian North', 'Bearskin', 'Wideroe|Widerøe', 'Atlantic Airways', 'Aurigny', 'Blue Islands', 'Isles of Scilly Skybus|Skybus', 'Eastern Airways', 'Emerald Airlines'],
    },
  },
  {
    id: 'bra-social-media',
    theme: 'brands',
    prompt: 'Name a social media platform or app',
    open: true,
    answers: {
      plankton: ['Instagram|Insta', 'TikTok|Tik Tok', 'Facebook', 'Snapchat|Snap'],
      shrimp: ['X|Twitter', 'YouTube', 'WhatsApp', 'Reddit', 'LinkedIn', 'Pinterest', 'Discord', 'Threads', 'BeReal|Be Real', 'Twitch'],
      jellyfish: ['Tumblr', 'Telegram', 'WeChat', 'Bluesky', 'Mastodon', 'Signal', 'Messenger|Facebook Messenger', 'Weibo', 'Douyin', 'Vine', 'MySpace', 'Bebo', 'Google+|Google Plus', 'Clubhouse', 'Quora', 'Flickr', 'Vimeo', 'Kick', 'Line', 'Viber', 'Kik', 'Truth Social', 'Lemon8', 'Xiaohongshu|RedNote|Little Red Book', 'Strava', 'Letterboxd', 'Goodreads', 'Nextdoor', 'Yik Yak', 'Periscope', 'Musical.ly|Musically', 'Friends Reunited', 'Habbo|Habbo Hotel', 'Club Penguin', 'Roblox', 'Steam', 'Hinge', 'Tinder', 'Bumble'],
      octopus: ['Orkut', 'Friendster', 'Hi5', 'Xanga', 'LiveJournal', 'Digg', 'Delicious', 'StumbleUpon', 'Path', 'Ello', 'Peach', 'Vero', 'Gab', 'Parler', 'Gettr', 'Minds', 'MeWe', 'Diaspora', 'Plurk', 'Cohost', 'Hive Social', 'Post', 'Spoutible', 'Substack|Substack Notes', 'Medium', 'Behance', 'Dribbble', 'DeviantArt', 'ArtStation', 'Pixiv', 'VSCO', 'Untappd', 'Foursquare|Swarm', 'Yelp', 'Glassdoor', 'Xing', 'VK|VKontakte', 'Odnoklassniki|OK.ru', 'QQ', 'Qzone', 'Kuaishou', 'Bilibili', 'Zhihu', 'Douban', 'Naver', 'KakaoTalk|Kakao', 'Band', 'Mixi', 'Ameba', 'ShareChat', 'Moj', 'Josh', 'Koo', 'Hike', 'Imo', 'Zalo', 'Skype', 'Ask.fm|Ask fm', 'Tellonym', 'NGL', 'Gas', 'Poparazzi', 'Dispo', 'Locket', 'Airchat', 'Noplace', 'Saturn', 'Yubo', 'Wink', 'Houseparty', 'Marco Polo', 'Triller', 'Byte', 'Dubsmash', 'Likee', 'Funimate', 'Smule', 'SoundCloud', 'Bandcamp', 'Last.fm', 'Mixcloud', 'Patreon', 'OnlyFans', 'Ko-fi', 'Fediverse', 'Lens', 'Farcaster', 'Nostr', 'Damus', 'Pixelfed', 'PeerTube', 'Lemmy', 'Kbin', 'Tildes', 'Hacker News', 'Slashdot', 'Fark', '4chan', 'Something Awful', 'Neopets', 'Stardoll', 'Moshi Monsters', 'Miniclip', 'Second Life', 'IMVU', 'Gaia Online', 'Wattpad', 'AO3|Archive of Our Own', 'FanFiction.net', 'Fandom', 'Amino', 'Meetup', 'Couchsurfing', 'Peanut', 'Mumsnet', 'Gransnet', 'Netmums', 'The Student Room'],
    },
  },
  {
    id: 'bra-supermarket',
    theme: 'brands',
    prompt: 'Name a UK supermarket chain',
    hint: 'Current or former',
    answers: {
      plankton: ['Tesco', 'Sainsbury\'s|Sainsburys', 'Asda', 'Aldi', 'Lidl'],
      shrimp: ['Morrisons', 'Waitrose', 'Co-op|Coop|The Co-operative', 'Marks & Spencer|M&S|Marks and Spencer', 'Iceland'],
      jellyfish: ['Ocado', 'Farmfoods', 'Spar', 'Costco', 'Booths', 'Budgens', 'Londis', 'Nisa', 'Premier', 'One Stop', 'Costcutter', 'Heron Foods|Heron', 'Jack\'s|Jacks', 'Whole Foods|Whole Foods Market', 'Booker', 'Makro', 'Amazon Fresh', 'Somerfield', 'Safeway', 'Kwik Save', 'Netto', 'Fine Fare', 'Gateway', 'Presto', 'Wm Low', 'Bejam', 'Food Giant', 'Mace', 'Lo-Cost', 'Hillards', 'Normans', 'Liptons', 'Key Markets', 'International', 'Victor Value', 'Shoppers World', 'Plymco', 'Dunnes Stores|Dunnes', 'SuperValu', 'Centra', 'Musgrave', 'Eurospar', 'Select Convenience', 'Day-Today', 'McColl\'s|McColls', 'Martin McColl', 'Morrisons Daily', 'Little Waitrose', 'Tesco Express', 'Sainsbury\'s Local', 'Simply Fresh', 'Planet Organic', 'As Nature Intended', 'Cooltrader', 'Fulton Foods|Fultons'],
    },
  },
];
