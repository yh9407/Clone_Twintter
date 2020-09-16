import React, {useEffect, useState} from "react";
import "firebase/auth"
import "firebase/database"
import {dbService} from "../fbase";
import Tweet from "../components/Tweet";


const Home = ({userObj}) => {
    const [tweet, setTweet] = useState("");
    const [tweets, setTweets] = useState([]);
    // const getTweets = async () => {
    //     const dbtweets = await dbService.collection("tweets").get();
    //     dbtweets.forEach((document) => {
    //         const tweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setTweets((prev) => [tweetObject, ...prev]);
    //     });
    // }
    useEffect(() => {
        dbService.collection("tweets").onSnapshot(snapshot => {
            const tweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(tweetArray)
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("tweets").add({
            text: tweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,

        });
        setTweet("");
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setTweet(value);
    };

    return (

        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="What's on your mind??"
                    maxLength={120}
                    value={tweet}
                    onChange={onChange}
                />
                <input
                    type="submit"
                    value={"Tweets"}
                />
            </form>
            <div>
                {tweets.map((tweet) => (
                    <Tweet
                        key={tweet.id}
                        tweetObj={tweet}
                        isOwner={tweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>

    )
};
export default Home;