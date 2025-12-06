const EditPetForm = () => {
    return (
        <form className="w-4/5 h-full flex flex-col justify-around items-center">
            <div className="w-full h-1/10 flex justify-center items-center mt-8">
                <p className="flex items-center h-full w-1/2">Pet ID: [id]</p>
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
            <button className="w-3/10 h-1/10 bg-blue-400 border-4 rounded-lg">Update Changes</button>
        </form>
    );
}

export default EditPetForm;