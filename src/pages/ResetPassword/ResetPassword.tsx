import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import TobetoTextInput from '../../utilities/customFormControls/TobetoTextInput'
import { Button, Col, Row } from 'react-bootstrap'
import './ResetPassword.css'
import ChangePasswordRequest from '../../models/requests/auth/changePasswordRequest'
import authService from '../../services/authService'
import { useNavigate, useParams } from 'react-router-dom'
import userService from '../../services/userService'
import { useDispatch } from 'react-redux'
import { authActions } from '../../store/auth/authSlice'
import ResetTokenUserRequest from '../../models/requests/user/resetTokenRequest'
import { PASSWORDS_DO_NOT_MATCH, PASSWORD_CHANGE_FAIL, PASSWORD_IS_CHANGED } from '../../environment/messages'
import ProfileToaster from '../../components/ProfileToaster/ProfileToaster'
import ProfileToasterError from '../../components/ProfileToasterError/ProfileToasterError'


export default function ResetPassword() {
    const { userId, resetToken } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (userId && resetToken) {
            const resetTokenUserRequest: ResetTokenUserRequest = {
                userId: userId,
                resetToken: resetToken
            }
            console.log(resetTokenUserRequest)

            userService.getByResetToken(resetTokenUserRequest).then((result: any) => {
                console.log(result.data)

                if (!result.data) navigate("/giris");
            })
        }
        else navigate("/not-found");
    }, [userId, resetToken]);


    const dispatch = useDispatch();
    const initialValues = {
        oldPassword: "",
        newPassword: ""
    };

    const handleChangePassword = async (values: any) => {
        const changePasswordRequest: ChangePasswordRequest = {
            userId: userId!,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
        }

        const result = await authService.changePassword(changePasswordRequest)
        if (result.data) {
            dispatch(authActions.removeToken());
            ProfileToaster({ name: PASSWORD_IS_CHANGED });
            navigate("/giris");
        }
        else{
            ProfileToasterError({ name: PASSWORD_CHANGE_FAIL });
        }
    }
    return (
        <div className="row">
            <div className="container text-center">
                <div className='reset-password-page col-md-6'>
                    <h1>Şifre Sıfırlama</h1>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        onSubmit={(values) => {
                            if (values.oldPassword === values.newPassword) handleChangePassword(values)
                            else ProfileToasterError({
                                name: PASSWORDS_DO_NOT_MATCH
                            });
                        }}>
                        <Form className="login-form ">
                            <Row>
                                <Col className='offset-1  mb-4' md={10}>
                                    <TobetoTextInput
                                        className="mb-4"
                                        type="password"
                                        placeholder="Şifre"
                                        name="newPassword" />
                                    <TobetoTextInput
                                        className=""
                                        placeholder="Şifre Tekrar"
                                        type="password"
                                        name="confirmPassword" />
                                </Col>
                            </Row>
                            <Button className="mb-4 reset-button" type="submit">
                                Gönder
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}