import { useMutation } from 'react-query';
import { Token } from '../types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { setRefreshToken, loginState, useAxios } from '../utils';
import { useNavigate } from 'react-router-dom';
import { AxiosInstance } from 'axios';

const deleteUser = async (axiosInstance: AxiosInstance): Promise<Token> => { 
	const response = await axiosInstance.delete(
		'/api/account',
	);
	return response.data;
};

export function useDeleteUser() {
    const accessToken = useRecoilValue<{accessToken: string, accessExpiredDate: Date}>(loginState);
    const axiosInstance = useAxios(accessToken.accessToken, accessToken.accessExpiredDate);
    const setLogin = useSetRecoilState(loginState);
    const navigate = useNavigate();
    return useMutation(() => deleteUser(axiosInstance), {
        onSuccess: () => {
            setLogin({
                isLogin: false,
                accessToken: '',
                accessExpiredDate: new Date(),
            });
            setRefreshToken('', new Date());
            alert("회원 탈퇴가 완료되었습니다.");
            navigate('/login');
        },
        onError: (e) => {
            console.log(e);
        }
});
}