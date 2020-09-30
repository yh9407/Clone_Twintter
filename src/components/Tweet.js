import React, {useState} from "react";
import {dbService, storageService} from "../fbase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPencilAlt} from "@fortawesome/free-solid-svg-icons";

const Tweet = ({tweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    //edit 상태인지 아닌지 true false로 나타냄
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    //input에 입력된 Edit text를 업데이트 해줌
    const onDeleteClick = async () => {
        const ok = window.confirm("ARE YOU SURE U WANT TO DELETE THIS TWEET??")
        if (ok) {
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
            await storageService.refFromURL(tweetObj.attachmentUrl).delete();
            //collect 안에 id 값
            //delete
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(tweetObj, newTweet)
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text: newTweet
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewTweet(value);
    }
    //isOwner 가 true 값이 아니라면, Delete,Edit 버튼 및 inputBox 가 보이지 않게 함.
    return (
        <div className="nweet">
            {
                editing ? (
                    <>
                        {isOwner && <>
                            <form onSubmit={onSubmit} className="container nweetEdit">
                                <input
                                    type="text"
                                    placeholder="Edit your Tweet"
                                    value={newTweet}
                                    required
                                    onChange={onChange}
                                />
                                <input type="submit" value="Update Nweet" className="formBtn"/>
                            </form>
                            <span onClick={toggleEditing} className="formBtn cancelBtn">
                                    Cancel
                                  </span>
                        </>}
                    </>
                ) : (
                    <>
                        <h4>{tweetObj.text}</h4>
                        {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl}/>}
                        {isOwner && (
                            <div className="nweet__actions">
                              <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash}/>
                              </span>
                                <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt}/>
                              </span>
                            </div>
                        )}
                    </>
                )
            }
        </div>
    );
}
export default Tweet;