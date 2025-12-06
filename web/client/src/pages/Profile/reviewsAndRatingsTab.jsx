const RatingsTab = () => {
    return (
        <>
            <div className="w-full min-h-[inherit] flex flex-col items-center justify-around">
                <h1 className="text-4xl">Send a review</h1>
                <form className="w-4/5 h-full flex flex-col justify-around items-center">
                    <div className="w-full h-1/10 flex justify-center items-center mt-8">
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="dname">Send to</label>
                            <input name='dname' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                        </div>
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="rating">Rating</label>
                            <input name='rating' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                        </div>
                    </div>
                    <div className="w-full h-4/10 flex justify-center items-center mt-8">
                        <div className="flex flex-col h-full w-full">
                            <label htmlFor="details">Details</label>
                            <textarea name='details' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></textarea>
                        </div>
                    </div>
                    <button className="w-3/10 h-1/10 bg-blue-400 border-4 rounded-lg">Confirm</button>
                </form>
            </div>
            <div className="w-full min-h-[inherit] flex items-center justify-around">
                <p>Rating: [rating]</p>
                <p>Rank: [rating]</p>
            </div>
        </>
    );
}

export default RatingsTab;