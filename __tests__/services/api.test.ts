import { fetchVehicles } from '@/services/api';


describe('fetchVehicles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches vehicles successfully with default parameters', async () => {
    const mockResponse = {
      content: {
        vehicles: [{ id: 1, name: 'Vehicle 1' }],
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchVehicles({});
    expect(global.fetch).toHaveBeenCalledWith(
      'https://develop-back-rota.rota361.com.br/recruitment/vehicles/list-with-paginate?type=tracked&page=1&perPage=20',
      {
        headers: {
          Authorization: `Bearer mock-api-key`,
          'Content-Type': 'application/json',
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it('fetches vehicles with custom parameters', async () => {
    const mockResponse = {
      content: {
        vehicles: [{ id: 2, name: 'Vehicle 2' }],
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchVehicles({
      page: 2,
      perPage: 10,
      filter: 'test',
      filterTypeParam: 'others',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://develop-back-rota.rota361.com.br/recruitment/vehicles/list-with-paginate?type=others&page=2&perPage=10&filter=test',
      {
        headers: {
          Authorization: `Bearer mock-api-key`,
          'Content-Type': 'application/json',
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it('throws an error when the API returns a non-200 status', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve({}),
      } as Response)
    );

    await expect(fetchVehicles({})).rejects.toThrow('Erro ao buscar veículos');
  });

  it('throws an error when the fetch call fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await expect(fetchVehicles({})).rejects.toThrow('Erro ao buscar veículos');
  });
});