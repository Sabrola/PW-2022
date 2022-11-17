import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from '../lib/api'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export default function KarangoList() {

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
    {
      field: 'editar',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params => (
        <IconButton aria-label = 'Editar'>
          < EditIcon />
        </IconButton>
      )
    },
    {
      field: 'excluir',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params => (
        <IconButton aria-label = 'Excluir' onClick={() => handleDeleteClick(params.id)}>
          < DeleteForeverIcon color="error" />
        </IconButton>
      )
    },
  ];

    const [state, setState] = React.useState({
      karangos: [] //Vetor vazio.
    })
    const {karangos} = state

    async function handleDeleteClick(id) {
      if (window.confirm('Deseja realmente excluir este item?')) {
        try {
          await api.delete(`karangos/${id}`)
          fetchData()
          window.alert('Item excluído com sucesso.')
          //Recarrega os dados da grid
        } catch(error) {
          window.alert('ERRO: Não foi possível excluir.\nMotivo:' + error.message)
        }
      }
    }

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
            sx={{
              //Esconde os botões de editar e excluir na visualozação normal.
              '& .MuiDataGrid-row button': {
                visibility: 'hidden'
              },
              //Retorna a visibilidade dos botões quando o mouse estiver em cima.
              '& .MuiDataGrid-row:hover button': {
                visibility: 'visible'
              },
            }}
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
