import { useNavigate } from "react-router-dom";

const TopBar = ({activeTab}) => {
    const availableTabs = ["profile", "pets", "appointment", "ratings"];
    const navigate = useNavigate();

    return (
        <div className="w-full h-[100px] flex bg-[linear-gradient(135deg,var(--primary-600)_0%,var(--primary-800)_100%)] border-blue-950 border-b-4">
            <div className="w-1/5 h-full flex justify-around items-center">
                <div className="h-9/10 aspect-square border-4 border-white bg-gray-300 rounded-full"></div>
                <p>[name]</p>
                <p>[email]</p>
            </div>
            <div className="w-3/5 h-full flex justify-around items-center border-x-4 border-blue-950">
                {availableTabs.map(tab => (
                    <button key={tab} onClick={() => navigate('/' + tab)} className={`w-2/10 h-9/10 border-4 border-blue-950 rounded-md ${activeTab === tab ? 'text-white' : 'bg-white'}`}>
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="w-1/5 h-full flex justify-around items-center">
                <button className='w-6/10 h-7/10 bg-red-400 rounded-lg text-white'>
                    LOG OUT
                </button>
            </div>
        </div>
    );
}

export default TopBar;