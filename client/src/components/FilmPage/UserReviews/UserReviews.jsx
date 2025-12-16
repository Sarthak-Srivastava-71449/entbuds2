import React, { useEffect, useState } from "react";
import "./UserReviews.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, TextField } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import {
  fetchReviewsByTitle,
  editReview,
  deleteReview,
  toggleReviewLike,
  replyToReview,
} from '../../../services/backendService';
import { getErrorMessage } from '../../../utils/apiHelpers';


const UserReviews = (props) => {
  const { user } = useAuth0();
  const { name } = props;
  const { username } = props;
  const [CustReviews, setCustReviews] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");
  const [showEditForm, setShowEditForm] = useState({});
  const [showReplySection, setShowReplySection] = useState({});


  const styling = {
    color: "white",
  };

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        const data = await fetchReviewsByTitle(name);
        if (isMounted) {
          if (data.exist) {
            setCustReviews(data.out.reviews);
          }
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [name]);

  const handleShowEditForm = (text, reviewId) => {
    setEditText(text);
    setShowEditForm((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));
  };

  const handleEditReview = async (e, review) => {
    e.preventDefault();

    try {
      const updatedReview = await editReview(name, review._id, editText);
      const updatedReviews = CustReviews.map((r) =>
        r._id === updatedReview._id ? updatedReview : r
      );
      setCustReviews(updatedReviews);
      setShowEditForm({});
    } catch (err) {
      console.error('Error updating review:', err);
      alert(getErrorMessage(err) || 'Failed to update review');
    }
  };


  const handleDeleteReview = async (e, review) => {
    try {
      await deleteReview(name, review._id, username);
      const updatedReviews = CustReviews.filter(
        (reviews) => reviews._id !== review._id
      );
      setCustReviews(updatedReviews);
    } catch (err) {
      console.error('Error deleting review:', err);
      alert(getErrorMessage(err) || 'Failed to delete review');
    }
  };

  const handleLikeReview = async (e, review) => {
    try {
      const updatedReview = await toggleReviewLike(name, review._id, user.email);
      const updatedReviews = CustReviews.map((r) =>
        r._id === updatedReview._id ? updatedReview : r
      );
      setCustReviews(updatedReviews);
    } catch (err) {
      console.error('Error liking review:', err);
      alert(getErrorMessage(err) || 'Failed to like review');
    }
  };

  const handleReplyReview = async (e, review) => {
    e.preventDefault();
    try {
      const updatedReview = await replyToReview(name, review._id, {
        text: replyText,
        user: user.name,
        userimage: user.picture,
      });
      const updatedReviews = CustReviews.map((r) =>
        r._id === review._id ? updatedReview : r
      );
      setCustReviews(updatedReviews);
      setReplyText("");
      setShowReplySection({});
    } catch (err) {
      console.error('Error replying to review:', err);
      alert(getErrorMessage(err) || 'Failed to reply to review');
    }
  };

  const toggleReplySection = (reviewId) => {
    setShowReplySection((prevState) => ({
      ...prevState,
      [reviewId]: !prevState[reviewId],
    }));
  };


  return (
    <div style={styling}>
      {CustReviews.length > 0 &&
        CustReviews.map((review) => {
          const isReplySectionVisible = showReplySection[review._id];
          
          return (
            <div className="letsrevw"  key={review._id}>
              
              <div className="textrev">
                <div className="mainrev">
                  <div className="reviewtext">
                <img src={review.image} className="ppic" alt="prof_pic" />
                <div>
                  <h3>{review.name}</h3>
                  <p key={review._id}>
                    <p style={{ marginRight: "5.6em" }}>{review.review}</p>
                  </p>
                  </div>
                  </div>


                  {user && review.name === user.name && showEditForm[review._id] && (
                    <form className="edit" onSubmit={(e) => handleEditReview(e, review)}>
                      <input
                        type="text"
                        placeholder="Edit Review"
                        className="changer"
                        style={{ color: 'white', fontSize: '12px', paddingLeft: "1em" }}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <Button type="submit" style={{background: 'red', height: '3.6vh', marginLeft: '1vw', color: 'white'}}><DoneIcon /></Button>
                    </form>
                  )}


                </div>

                <div className="btns">
                  <div className="likes">



                    <FavoriteBorderIcon onClick={(e) => handleLikeReview(e, review)}
                      sx={{ fontSize: 16 }}
                    />
                    <b className="lc">{review.likes.length}</b>


                  </div>

                  {user && review.name === user.name &&

                    <EditIcon onClick={() => handleShowEditForm(review.review, review._id)}
                      sx={{ fontSize: 16 }}
                    />}


                  <ReplyIcon onClick={() => {
                    toggleReplySection(review._id);
                  }}
                    sx={{ fontSize: 16 }}
                  />

                  {user && review.name === user.name &&
                    <DeleteIcon onClick={(e) => handleDeleteReview(e, review)}
                      sx={{ fontSize: 16 }}
                    />
                  }

                </div>

                {isReplySectionVisible && (
                  <div className="replysection">
                    {review.replies && (
                      <div className="replies">
                        {review.replies.map((reply) => (
                          <div className="reply" key={reply._id}>
                            <img
                              className="rpic"
                              src={reply.userimage}
                              alt="img"
                            ></img>
                            <div className="userrepl">
                              <h3>{reply.user}</h3>
                              <p> {reply.text}</p>
                              

                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={(e) => handleReplyReview(e, review)} className="handle">
                      <div className="replyform">
                        <TextField
                          className="replyhere"
                          placeholder="Add your reply"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          style={{
                            height: "4vmax",
                            width: "14em",
                            marginRight: "63em"
                          }}
                        />
                        <Button type="submit"
                          style={{
                            background: "red",
                            color: "black",
                            display: "flex",
                            alignItems: "center",
                            height: "2em"
                          }}>Submit</Button>
                      </div>
                    </form>

                  </div>
                )}

              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UserReviews;
