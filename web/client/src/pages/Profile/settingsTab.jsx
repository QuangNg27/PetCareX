const SettingsTab = () => {
    return (
        <form className="w-1/2 flex flex-col justify-around items-center">
            <p>Customer ID: [id]</p>
            <div className="w-full h-1/10 flex justify-center items-center mt-8">
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="fname">First Name</label>
                    <input name='fname' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                </div>
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="lname">Last Name</label>
                    <input name='lname'className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                </div>
            </div>
            <div className="w-full h-1/10 flex justify-center items-center mt-8">
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="email">Email</label>
                    <input name='email' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                </div>
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="phonenum">Phone Number</label>
                    <input name='phonenum' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                </div>
            </div>
            <div className="w-full h-1/10 flex justify-center items-center mt-8">
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="cid">ID</label>
                    <input name='cid' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                </div>
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="sex">Sex</label>
                    <select name='sex' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4">
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
            </div>
            <div className="w-full h-1/10 flex justify-center items-center mt-8">
                <div className="flex flex-col h-full w-1/2">
                    <label htmlFor="dob">Date of Birth</label>
                    <input name='dob' type="date" className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                </div>
            </div>
            <button className="w-3/10 h-1/10 bg-blue-400 border-4 rounded-lg">Update Changes</button>
        </form>
    );
}

export default SettingsTab;