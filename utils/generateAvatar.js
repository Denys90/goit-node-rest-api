import gravatar from "gravatar";
import Jimp from "jimp";
import path from "node:path";

const generateAvatar = async (email) => {
  const options = {
    size: 250,
    rating: "pg",
    default: "identicon",
  };

  const avatarURL = gravatar.url(email, options);

  const httpsAvatarURL = "https:" + avatarURL;
  const image = await Jimp.read(httpsAvatarURL);
  image.resize(250, 250);

  const newFilePath = path.join(process.cwd(), "public/avatars", `${email}.png`);

  await image.writeAsync(newFilePath);
  console.log(httpsAvatarURL);

  return httpsAvatarURL;
};

export default generateAvatar;
