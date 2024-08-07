import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { ADMIN_ROLE } from '../../environment/environment';
import { NOT_PERMISSION } from '../../environment/messages';
import ProfileToasterError from '../ProfileToasterError/ProfileToasterError';

type Props = {
    children: any;
};

const ProtectedRoute = (props: Props) => {
    const navigate = useNavigate();
    const tokenState = useSelector((state: any) => state.auth);
    const user = authService.getUserInfo();
    
    useEffect(() => {
        if (user?.role !== ADMIN_ROLE || !tokenState.isAuthenticated) {
            ProfileToasterError({ name: NOT_PERMISSION })
            navigate("/platform");
        }
    }, []);

    return <>{props.children}</>;
};

export default ProtectedRoute;