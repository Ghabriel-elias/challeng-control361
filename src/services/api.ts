import { VehicleResponse } from "@/interfaces/vehicleInterfaces";

const apiKey = process.env.NEXT_PUBLIC_API_KEY

interface FetchVehiclesParams {
  page?: number;
  perPage?: number;
  filter?: string;
  filterTypeParam?: 'tracked' | 'others'
}

export async function fecthVehicles({
  page = 1,
  perPage = 20,
  filter = '',
  filterTypeParam = 'tracked'
}: FetchVehiclesParams): Promise<VehicleResponse> {
  const url = `https://develop-back-rota.rota361.com.br/recruitment/vehicles/list-with-paginate?type=${filterTypeParam}&page=${page}&perPage=${perPage}${filter ? `&filter=${filter}` : ''}`
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    if(response?.status !== 200) {
      throw new Error('Error fetching vehicles')
    }
    const data = await response.json();
    return data
  } catch (error) {
    throw new Error(`Erro ao buscar veículos`);
  }
}