import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { getDatabase, ref, get } from "firebase/database";
import { ThemeProvider, Button } from "react-bootstrap";
import Navigation from "./Navbar";

const MyGridComponent = () => {

    const app = firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
    });

    const database = getDatabase(app);
    const [rowData, setRowData] = useState([]);
    const { currentUser } = useAuth();
    const [userStatus, setUserStatus] = useState('');


    useEffect(() => {
        if (currentUser) {
            const userId = currentUser.uid;
            const userRef = ref(database, `database/users/${userId}`);

            get(userRef).then((snapshot) => {
                if(snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserStatus(userData.status || 'active');
                }
            }).catch((error) => {
                console.error('Error fetching user data:', error);
            });
        }
    }, [currentUser]);

    useEffect(() => {
        const dbRef = ref(database, 'database/users/');
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const formattedData = Object.values(data).map((user) => {
                    return {
                        ...user,
                        regTime: new Date(user.regTime).toLocaleString(),
                        lastLoginTime: new Date(user.lastLoginTime).toLocaleString(),
                    };
                });

                setRowData(formattedData);
            } else {
                console.log('No data available');
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [database]);

    const columnDefs = [
        { 
            headerName: 'userId', 
            field: 'userId',
            headerCheckboxSelection: true,
            checkboxSelection: true, 
        },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Name', field: 'username' },
        { headerName: 'Registration Time', field: 'regTime'},
        { headerName: 'Last Login Time', field: 'lastLoginTime'},
        { headerName: 'Status', field: 'status' },
    ];


    return ( 
        <div>
            {userStatus === 'active' ? (
                <div className="ag-theme-quartz" style={{ height: 600, Maxwidth: '70vw', minWidth: '40vw' }}>
                <AgGridReact 
                    columnDefs={columnDefs}
                    rowData={rowData}
                    rowSelection={'multiple'}
                />
            </div>
            ) : (
                <h1>Acces denied. Your account has been blocked.</h1>
            )}
            
        </div>
    );
};

const Dashboard = () => {
    return (
        <ThemeProvider 
            breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} 
            minBreakpoint="xxs">
            <div>
                <Navigation/>
                <Button >Delete</Button>
                <MyGridComponent />
            </div>
        </ThemeProvider>
    );
};


export default Dashboard;