import { imageURL } from './config.js';

const images = {
  '/images/brownies.jpg': require('../assets/images/brownies.jpg'),
  '/images/cake.jpg': require('../assets/images/cake.jpg'),
  '/images/chips-table.jpg': require('../assets/images/chips-table.jpg'),
  '/images/cookies.jpg': require('../assets/images/cookies.jpg'),
  '/images/donuts.jpg': require('../assets/images/donuts.jpg'),
  '/images/hero-assortment.jpg': require('../assets/images/hero-assortment.jpg'),
  '/images/klepon.jpg': require('../assets/images/klepon.jpg'),
  '/images/muffin-tray.jpg': require('../assets/images/muffin-tray.jpg'),
  '/images/pie-plate.jpg': require('../assets/images/pie-plate.jpg'),
  '/images/pudding-cup.jpg': require('../assets/images/pudding-cup.jpg'),
  '/images/seeds.jpg': require('../assets/images/seeds.jpg'),
  '/images/story.jpg': require('../assets/images/story.jpg'),
};
export const imageSource = (path) => images[path] || { uri: imageURL(path) };
