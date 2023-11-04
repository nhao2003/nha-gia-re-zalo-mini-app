import AppConfig from "../constant/app_configs";
import Transaction from "../types/transaction";

export const getTransaction = async (
  id: string
): Promise<Transaction | null> => {
  try {
    const apiUrl =
      AppConfig.API_URL + `/api/v1/membership-package/transactions?id=${id}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching data from the server. Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    throw error;
  }
};
export default getTransaction;
