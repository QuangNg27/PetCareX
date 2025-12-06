import SettingsTab from './settingsTab'
import PetsTab from './petsTab'
import AppointmentTab from './appointmentsTab'
import RatingsTab from './reviewsAndRatingsTab'

const ProfileBody = ({activeTab}) => {
    return (
        <div className="min-h-[calc(100vh-200px)] w-full flex justify-center px-[10%]">
            {activeTab == 'profile' && <SettingsTab/>}
            {activeTab == 'pets' && <PetsTab/>}
            {activeTab == 'appointment' && <AppointmentTab/>}
            {activeTab == 'ratings' && <RatingsTab/>}
        </div>
    );
}

export default ProfileBody;