import React, {useState} from "react";
import {dbService} from "../fbase";

const Tweet = ({tweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    //edit 상태인지 아닌지 true false로 나타냄
    const [newTweet, setNewTweet] = useState(tweetObj.text);
    //input에 입력된 Edit text를 업데이트 해줌
    const onDeleteClick = async () => {
        const ok = window.confirm("ARE YOU SURE U WANT TO DELETE THIS TWEET??")
        if (ok) {
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
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
    return (
        <div>
            {
                editing ? (
                    <>
                        {isOwner && <>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    placeholder="Edit your Tweet"
                                    value={newTweet}
                                    required
                                    onChange={onChange}
                                />
                                <input type="submit" value="Update Tweet"/>
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>}
                    </>
                ) : (
                    <>
                        <h4>{tweetObj.text}</h4>
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Tweet</button>
                                <button onClick={toggleEditing}>Edit Tweet</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    );
}
export default Tweet;