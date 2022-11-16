import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from '../lib/api'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const columns = [
    {
      field: 'id',            //Campo nos dados retornados
      headerName: 'Cód.',
      type: 'number',          //Coluna fica alinhada a direita
      width: 90 },
    {
      field: 'marca',
      headerName: 'Marca/Modelo',
      width: 300,
      valueGetter: params =>params.row?.marca + ' ' + params.row?.modelo
    },
    {
      field: 'ano_fabricacao',
      headerName: 'Ano Fabr.',
      type: 'number',
      width: 110,
    },
    {
      field: 'cor',
      headerName: 'Cor',
      headerAlign: 'center',  //Alinhamento do cabeçalho
      align: 'center',        //Alinhamento dos dados
      width: 110,
    },
    {
      field: 'placa',
      headerName: 'Placa',
      headerAlign: 'center',  //Alinhamento do cabeçalho
      align: 'center',        //Alinhamento dos dados
      width: 110,
    },
    {
      field: 'importado',
      headerName: 'Importado',
      headerAlign: 'center',  //Alinhamento do cabeçalho
      align: 'center',        //Alinhamento dos dados
      width: 110,
      renderCell: params => (
      parseInt(params.row?.importado) ? < CheckCircleIcon /> : < RadioButtonUncheckedIcon />
      )
    },
    {
      field: 'preco',
      headerName: 'Preço Venda',
      type: 'number',
      width: 120,
      valueGetter: params => (
        //Formatando os preços para números conforme usados no Brasil (pt-BR) e em
        //moeda real brasileira (BRL).
        Number(params.row?.preco).toLocaleString(
          'pt-BR', { style: 'currency', currency: 'BLR'})
      )
    },
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];

export default function KarangoList() {

    const [state, setState] = React.useState({
      karangos: [] //Vetor vazio.
    })
    const {karangos} = state

    //useEffect com vetor de dependncias vazio para ser executado apenas uma vez
    //no momento da montagem do componente
    React.useEffect(() => { //Buscar os dados da API remota
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const response = await api.get('karangos')
            //Armazenar o response em uma varialvel de estado
            console.log({RESPONSE: response.data})
            setState({...state, karangos: response.data})
        }
        catch (error){
            alert('ERRRO' + error.message)
        }
    }

    return (
        <>

        <hi> Listagem de Karangos </hi>
        
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
            rows={karangos}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            autoHeight
            disableSelectionOnClick
        />

        </Box>
        </>
    )
}
