import { useState } from "react";

import TopBar from "./topBar";
import Footer from "../../components/common/footer";
import ProfileBody from "./profileBody"

const ProfilePage = ({activeTab}) => {
    return (
        <>
            <TopBar activeTab={activeTab}/>
            <ProfileBody activeTab={activeTab}/>
            <Footer/>
        </>
    );
}   

export default ProfilePage;