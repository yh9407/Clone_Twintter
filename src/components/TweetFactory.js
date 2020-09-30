import React, {useState} from "react";
import {dbService, storageService} from "../fbase";
import {v4 as uuidv4} from "uuid";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";


const TweetFactory = ({userObj}) => {
    const [tweet, setTweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (tweet === "") {
            return;
        }
        event.preventDefault();
        //사진을 업로드하는 트윗과 아닌 트윗을 비교
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    };
    /*
             사진을 먼저 업로드하고, 사진이 있다면, 그 업로드할 사진의 url을 tweets에 추가하는 형식으로 진행
              ({
                 text: tweet,
                 createdAt: Date.now(),
                 creatorId: userObj.uid,

             });
             setTweet("");
             */

    const onFileChange = (event) => {
        const {
            target: {files},
        } = event;
        const theFile = files[0];
        // console.log(theFile)
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            // console.log(finishedEvent);
            //target에 result값이 파일 url이 됨.
            const {
                currentTarget: {result},
            } = finishedEvent;
            setAttachment(result);
        }

        reader.readAsDataURL(theFile);
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setTweet(value);
    };
    const onClearAttachment = () => setAttachment("");
    return (

        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    type="text"
                    placeholder="What's on your mind??"
                    maxLength={120}
                    value={tweet}
                    onChange={onChange}
                />

                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            )}
        </form>
    );
};
export default TweetFactory;