import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { clearUser } from '@/store/authSlice/loginSlice';
import { deleteUserAccount } from '@/store/authSlice/authActions';
import DeleteModal from '@/components/modals/DeleteModal';

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.login.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const resultAction = await dispatch(deleteUserAccount());
            if (deleteUserAccount.rejected.match(resultAction)) {
                throw new Error(resultAction.payload);
            }
            dispatch(clearUser());
            alert('Account deleted successfully.');
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting account: ' + error.message);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div>
                    <h1 className='font-mont my-8 text-[30px]'>My Account Details</h1>
                    {user ? (
                        <div>
                            <p className='font-mont'><strong>Name:</strong> {user.displayName || 'N/A'}</p>
                            <p className='font-mont'><strong>Email:</strong> {user.email}</p>
                            <button
                                onClick={handleOpenModal}
                                className="py-2 my-4 px-4 bg-red-600 text-white rounded font-mont"
                            >
                                Delete Account
                            </button>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                    
                    <DeleteModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onConfirm={handleConfirmDelete}
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
};

export default Profile;
