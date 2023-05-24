const express = require("express");
const router = express.Router();
const share = require("share");
const list = require("../schemas/listSchema");

router.post("/add", async (req, resp) => {
  try {
    const { email, data } = req.body;
    const adder = await list.findOne({ email });
    if (adder) {
      const { likedFilms } = adder;
      const alreadyLiked = likedFilms.find(({ id }) => id === data.id);
      if (!alreadyLiked) {
        await list.findByIdAndUpdate(
          adder._id,
          {
            likedFilms: [...adder.likedFilms, data],
          },
          { new: true }
        );
      } else return resp.json({ msg: "Film is already liked" });
    } else await list.create({ email, likedFilms: [data] });
    return resp.json({ msg: "Added successfully" });
  } catch (e) {
    return resp.json({ msg: "Not added" });
  }
});

router.get("/likedmovie/:email", async (req, resp) => {
  try {
    const { email } = req.params;
    const liker = await list.findOne({ email });
    if (liker) {
      resp.json({ msg: "Success", movies: liker.likedFilms });
    } else return resp.json({ msg: "User not found" });
  } catch (e) {
    return resp.json({ msg: "Error" });
  }
});

router.put("/delete", async (req, resp) => {
  try {
    const { email, filmId } = req.body;
    const adder = await list.findOne({ email });
    if (adder) {
      const { likedFilms } = adder;
      const filmIndex = likedFilms.findIndex(({ id }) => id === filmId);
      if (filmIndex !== -1) {
        likedFilms.splice(filmIndex, 1);
        await adder.save();
        return resp.json({ msg: "Film deleted", movies: adder.likedFilms });
      } else {
        return resp.status(400).send({ msg: "Film not found" });
      }
    }
    return resp.status(400).send({ msg: "User not found" });
  } catch (e) {
    console.log(e);
    return resp.status(500).json({ msg: "Error" });
  }
});

// New route to share the list through WhatsApp
router.get("/share/:email", async (req, resp) => {
  try {
    const { email } = req.params;
    const liker = await list.findOne({ email });
    if (liker) {
      const shareText = generateShareText(liker.likedFilms);
      const whatsappLink = generateWhatsAppLink(shareText);
      return resp.json({ msg: "Success", shareLink: whatsappLink });
    } else {
      return resp.json({ msg: "User not found" });
    }
  } catch (e) {
    console.log(e);
    return resp.status(500).json({ msg: "Error" });
  }
});

// Helper function to generate the share text
function generateShareText(likedFilms) {
    // Customize the text based on your requirements
    let shareText = "Check out my liked content:\n";
    const films = likedFilms.filter(film => film.title);
    const TVShows = likedFilms.filter(film => film.name);
    if (films.length > 0) {
      shareText += "\nMovies:\n";
      films.forEach((film, index) => {
        const title = film.title || "Untitled";
        const number = index + 1;
        shareText += `${number}. ${title}\n`;
      });
    }
  
    if (TVShows.length > 0) {
      shareText += "\nTV Shows:\n";
      TVShows.forEach((film, index) => {
        const name = film.name || "Untitled";
        const number = index + 1;
        shareText += `${number}. ${name}\n`;
      });
    }
    return shareText;
}

// Helper function to generate the WhatsApp share link
function generateWhatsAppLink(text) {
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

module.exports = router;
