const AppointmentTab = () => {
    return (
        <div className="flex flex-col w-full min-h-[inherit]">
            <div className="w-full min-h-[inherit] flex flex-col items-center justify-around">
                <h1 className="text-4xl">Schedule an Appointment</h1>
                <form className="w-4/5 h-full flex flex-col justify-around items-center">
                    <div className="w-full h-1/10 flex justify-center items-center mt-8">
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="name">Pet Name</label>
                            <input name='name' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                        </div>
                    </div>
                    <div className="w-full h-1/10 flex justify-center items-center mt-8">
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="animal">Animal</label>
                            <input name='animal' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                        </div>
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="breed">Breed</label>
                            <input name='breed' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                        </div>
                    </div>
                    <div className="w-full h-1/10 flex justify-center items-center mt-8">
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="sex">Sex</label>
                            <select name='sex' className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4">
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>
                        <div className="flex flex-col h-full w-1/2">
                            <label htmlFor="dob">Date of Birth</label>
                            <input name='dob' type="date" className="w-9/10 h-full border-blue-400 border-4 rounded-lg pl-4"></input>
                        </div>
                    </div>
                    <button className="w-3/10 h-1/10 bg-blue-400 border-4 rounded-lg">Confirm Addition</button>
                </form>
            </div>
            <div className="w-full min-h-[inherit] flex items-center justify-around">
                <div className="w-1/4 h-full flex flex-col items-center justify-around">
                    <input placeholder="Find your pets..." className="w-9/10 h-1/10 border-blue-400 border-4 rounded-lg pl-4"></input>
                    <div className="w-full h-1/15"></div>
                    <ul className="w-9/10 h-8/10 border-blue-400 border-4 rounded-lg pl-4"></ul>
                </div>
                <div className="w-1/4 h-full flex flex-col items-center justify-around">
                    <input placeholder="Find your pets' appointment..." className="w-9/10 h-1/10 border-blue-400 border-4 rounded-lg pl-4"></input>
                    <div className="flex w-full h-1/15 justify-around items-center">
                        <label htmlFor="time-filter">Filter by</label>
                        <select name="time-filter" className="w-2/3 h-full border-blue-400 border-4 rounded-lg pl-4">
                            <option>Scheduled</option>
                            <option>Active</option>
                            <option>Complete</option>
                        </select>
                    </div>
                    <ul className="w-9/10 h-8/10 border-blue-400 border-4 rounded-lg pl-4"></ul>
                </div>
                <div className="w-2/4 h-full flex flex-col items-center justify-around">
                </div>
            </div>
        </div>
    );
}

export default AppointmentTab;