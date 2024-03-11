import Jimp from "jimp";

export const resizeImage = async (imagePath) => {
  const image = await Jimp.read(imagePath);
  await image.resize(250, 250).writeAsync(imagePath);
};
