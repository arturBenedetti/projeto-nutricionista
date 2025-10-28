import { ChangePasswordDTO } from '../DTOs/ChangePasswordDTO';

declare global {
  interface Window {
    api: {
      changePassword: (data: ChangePasswordDTO) => Promise<boolean>;
    };
  }
}

export const changePassword = async (
  data: ChangePasswordDTO
): Promise<boolean> => {
  try {
    const result = await window.api.changePassword(data);
    console.log(result);
    return result;    
  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    throw error;
  }
};

