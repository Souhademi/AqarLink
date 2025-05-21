import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import HomePage from "./Pages/HomePage";
import CreateInvestorAccount from "./Pages/Investor/CreateAccount"; // Ensure correct case
import CreateEstateAgencyAdminAccount from "./Pages/EstateAgency/CreateAccount";
import CreateEstateAgencyAdminAccount2 from "./Pages/EstateAgency/CreateAccount2";
import CreateInvestorAccount2 from "./Pages/Investor/CreateAccount2";
import InvestorLogin from "./Pages/Investor/Login"; // Adjust based on the actual file location
import EstateAgencyAdminLogin from "./Pages/EstateAgency/Login";

import ClientLogin from "./Pages/Client/Login";
import CreateClientAccount from "./Pages/Client/CreateAccount";
// import PropertySearch from "./Pages/Client/PropertySearch";
// import InvestorPropertyFilter from "./Pages/Investor/InvestorPropertyFilter";
import BusinessInfo from "./Pages/Client/BusinessInfo";
import SignIn from "./Pages/SignIn";
// import Dashboard from "./Pages/Dashboard";
import ProfileManagementClient from "./Pages/Client/ManageProfileClient";
import ProfileManagementInvestor from "./Pages/Investor/ManageProfileInvestor";
import ProfileManagementAgencyAdmin from "./Pages/EstateAgency/ManageProfileAgencyAdmin";
import SignInButton from "./Pages/SignInButton"
import Chatbot from "./Pages/ChatBot"
import InvestorChatBot from "./Pages/InvestorChatBot"
import AgencyChatBot from "./Pages/AgencyChatBot"
import AboutUs from "./Pages/AboutUs"
import AdminLogin from "./Pages/AdminLogin"
import DashboardAdmin from "./Pages/DashbordAdmin";
import PrivateRouteAdmin from "./Pages/PrivateRouteAdmin";
import AdminChat from "./Pages/AdminChat"
import DashboardClient from "./Pages/Client/DashboardClient"
import EmailVerification from "./Pages/Client/EmailVerification"
import AddClientProperty from "./Pages/Client/AddClientProperty"

import ForgetPasswordClient from "./Pages/Client/ForgetPasswordClient"
import ResetPasswordClient from "./Pages/Client/ResetPasswordClient"

import ForgetPasswordAgency from "./Pages/EstateAgency/ForgetPasswordAgency"
import ResetPasswordAgency from "./Pages/EstateAgency/ResetPasswordAgency"

import ForgetPasswordInvestor from "./Pages/Investor/ForgetPasswordInvestor"
import ResetPasswordInvestor from "./Pages/Investor/ResetPasswordInvestor"

import PrivateRoute from "./Pages/Client/PrivateRoute"
import NotificationsPage from "./Pages/Client/NotificationsPage"
import PropertyDetailsPage from "./Pages/Client/PropertyDetailsPage"
import SavedPropertiesPage  from "./Pages/Client/SavedPropertiesPage"
import AutoBotClient  from "./Pages/AutoChatBot"
import DashboardInvestor from "./Pages/Investor/DashboardInvestor";
import PropertyDetailsPageInv from "./Pages/Investor/PropertyDetailsPageInv"
import DashboardAgency from "./Pages/EstateAgency/DashboardAgency";
import PrivateRouteInvestor from './Pages/Investor/PrivateRouteInvestor';
import AgencyPrivateRoute from './Pages/EstateAgency/AgencyPrivateRoute';
function App() {
    return ( 



     



        <Router>
    {/* <div style={{ display: "flex", justifyContent: "space-around", padding: 40 }}>
        <ChatBotClient />
        <AdminChat />
      </div> */}
        <Routes>
            <Route path = "/"element = {<HomePage/>}/> 
            <Route path = "/client/login"element = {<ClientLogin/>}/> 
            <Route path = "/client/create-account"element = { < CreateClientAccount />}/> 
            <Route path = "/investor/login"element = {<InvestorLogin/>}/> 
            {/* <Route path = "/investor/investorPropertyFilter"element = {<InvestorPropertyFilter/>}/>  */}
            <Route path = "/client/business"element = {<BusinessInfo/>}/> 
            {/* <Route path = "/client/dashboardClient"element = {<DashboardClient/> }/>  */}
            <Route path="/client/dashboardClient" element={<PrivateRoute><DashboardClient /></PrivateRoute>} />
            <Route path="/client/dashboard" element={<PrivateRoute><DashboardClient /></PrivateRoute>} />



            <Route path="/admin/dashboard"element = {<DashboardAdmin/>}/> 
            <Route path="/admin/dashboard" element={<PrivateRouteAdmin><DashboardAdmin /></PrivateRouteAdmin>} />


            <Route path="/investor/dashboard" element={<DashboardInvestor/>}/>
            <Route path="/investor/dashboard" element={ <PrivateRouteInvestor><DashboardInvestor /></PrivateRouteInvestor>} />

            <Route path="/estateAgency/dashboard" element={<DashboardAgency/>}/>
            <Route path="/estateAgency/dashboard" element={ <AgencyPrivateRoute><DashboardAgency /></AgencyPrivateRoute>} />




            {/* <Route path = "/dashboard"element = { < Dashboard/>}/>  */}
            <Route path = "/client/notifications"element = { < NotificationsPage/>}/> 
            <Route path = "/investor/create-account"element = { < CreateInvestorAccount/>}/> 
            <Route path = "/estateAgency/login"element = { < EstateAgencyAdminLogin />}/> 
            <Route path = "/estateAgency/create-account"element = { < CreateEstateAgencyAdminAccount />}/> 
            <Route path = "/estateAgency/create-account2"element = {<CreateEstateAgencyAdminAccount2/>}/> 
         
            <Route path = "/investor/create-account2"element = {<CreateInvestorAccount2/>}/> 
            <Route path = "signIn"element = {<SignIn/>}/> 
            <Route path = "signInButton"element = {<SignInButton/>}/> 
            <Route path = "/client/profileManagementClient"element = {<ProfileManagementClient/>}/>
            <Route path = "/estateAgency/ProfileManagementAgencyAdmin"element = {<ProfileManagementAgencyAdmin/>}/> 
            <Route path = "/investor/profileManagementInvestor"element = {<ProfileManagementInvestor/>}/> 
            {/* <Route path = "/investor/profileManagementInvestor"element = {<ProfileManagementInvestor/>}/>  */}
            <Route path = "/chatbot"element = {<Chatbot/>}/> 
            <Route path = "/aboutUs"element = {<AboutUs/>}/> 
            <Route path = "/adminLogin"element = {<AdminLogin/>}/> 
            <Route path="/verify/:token" element={<EmailVerification />} />
            <Route path="/client/addPropertyFeatures" element={<AddClientProperty/>}/>
            <Route path="/client/saved-properties" element={<SavedPropertiesPage/>}/>
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/propertyInv/:id" element={<PropertyDetailsPageInv />} />

            <Route path="/client/forgetPassword" element={<ForgetPasswordClient />} />
            <Route path="/client/reset-password/:token" element={<ResetPasswordClient />} />

            <Route path="/estateAgency/forgetPassword" element={<ForgetPasswordAgency />} />
            <Route path="/estateAgency/reset-password/:token" element={<ResetPasswordAgency />} />

            <Route path="/investor/forgetPassword" element={<ForgetPasswordInvestor />} />
            <Route path="/investor/reset-password/:token" element={<ResetPasswordInvestor />} />

          
            </Routes > 
        </Router>
    );
}

export default App;
