  import React, { useEffect, useState } from 'react';
  import { AddbusStop, AddNewBus, deleteBusStopData, getAllBusData, getBusStop, updateBusData, updateBusStopData } from '../Service/service';
  import {
    Card,
    CardContent,
    Typography,
    Collapse,
    List,
    ListItem,
    ListItemText,
    Drawer,
    Box,
    Avatar,
    Divider,
    SvgIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
  } from '@mui/material';
  import {
    Button,
    Input,
    FormControl,
  } from "@mui/joy";
  import TextField from '@mui/material/TextField';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import { DirectionsBus } from '@mui/icons-material';
  import AddCircleIcon from '@mui/icons-material/AddCircle';
  import CancelIcon from '@mui/icons-material/Cancel';
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
  import Person4Icon from '@mui/icons-material/Person4';
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';


  export const AdminDashBoard = () => {
    const [existbuses, setExistBuses] = useState([]);
    const [busStops, setBusStops] = useState({});
    const [newBusData, setNewBusData] = useState({
      busId: '',
      route: '',
      startingPoint: '',
      endingPoint: '',
      totalFare: '',
    });

    const [newBusStop, setNewBusStop] = useState({
      stopName: '',
      fare: '',
    });

    const [addBusExpanded, setAddBusExpanded] = useState(false);
    const [addStopExpanded, setAddStopExpanded] = useState({});
    const [busExpanded, setBusExpanded] = useState({});
    const token = localStorage.getItem('token');

    const [editBusOpen, setEditBusOpen] = useState(false);
    const [editStopOpen, setEditStopOpen] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedStop, setSelectedStop] = useState(null);

    const navigate = useNavigate();



    const handleEditBusClick = (bus) => {
      setSelectedBus(bus);
      setEditBusOpen(true);
    };


    const handleEditStopClick = (stop) => {
      console.log(stop.fareFromStart)
      setSelectedStop(stop);
      setEditStopOpen(true);
    };

    const handleUpdateBus = async (busId,updatedBus) => {
      try {
        const response = await updateBusData(token,busId,updatedBus);
        console.log(response);
        fetchBuses(); 
        alert("Bus Update Successfully")
        setEditBusOpen(false)
        
      } catch (error) {
        console.error('Error updating bus:', error);
        alert("Error Upadte Bus")
      }
    }; 


    const handleUpdateBusStop = async (stopId,updatedStop) => {
      try {
        const response = await updateBusStopData(token,stopId,updatedStop);
        console.log(response)
        fetchBusStops(updatedStop.stopId);
        alert("update Success")
        setEditStopOpen(false)

      } catch (error) {
        console.error('Error updating bus stop:', error);
        alert("update failed")
      }
    };

    const handleChangeAddNewBus = (e) => {
      setNewBusData({ ...newBusData, [e.target.name]: e.target.value });
    };

    const handleChangeAddNewBusStop = (e) => {
      setNewBusStop({ ...newBusStop, [e.target.name]: e.target.value });
    };

    useEffect(() => {
      fetchBuses();
    }, []);

    const fetchBuses = async () => {
      try {
        const response = await getAllBusData(token);
        setExistBuses(response);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    const fetchBusStops = async (busId) => {
      try {
        const response = await getBusStop(token, busId);
        setBusStops((prevStops) => ({
          ...prevStops,
          [busId]: response,
        }));
      } catch (error) {
        console.error('Error fetching bus stops:', error);
      }
    };

    const handleAddBus = async () => {
      try {
        const response = await AddNewBus(
          newBusData.busId,
          newBusData.route,
          newBusData.startingPoint,
          newBusData.endingPoint,
          newBusData.totalFare,
          token
        );
        console.log(response);
        fetchBuses();
        setNewBusData({ busId: '', route: '', startingPoint: '', endingPoint: '', totalFare: '' });
        setAddBusExpanded(false);
      } catch (error) {
        console.error('Error adding bus:', error);
      }
    };

    const handleAddBusStop = async (busId) => {
      try {
        const response = await AddbusStop(newBusStop.stopName, newBusStop.fare, busId, token);
        console.log(response);
        fetchBusStops(busId);
        setNewBusStop({ stopName: '', fare: '' });
        setAddStopExpanded((prev) => ({ ...prev, [busId]: false }));
      } catch (error) {
        console.error('Error adding bus stop:', error);
      }
    };

    const handleDeleteBusStop = async(stopId)=>{
      try {
        const response = await deleteBusStopData(token,stopId);
        alert(response);
      } catch (error) {
        throw error
      }
      
    }

    const handleBusExpand = (busId) => {
      setBusExpanded((prev) => ({ ...prev, [busId]: !prev[busId] }));
      if (!busStops[busId]) {
        fetchBusStops(busId);
      }
    };

    const handleHome=()=>{
      navigate("/")
    }

    return (
      <Box sx={{ display: 'flex' }}>
        
            <Drawer
                    variant="permanent"
                    sx={{
                      width: 240,
                      flexShrink: 0,
                      '& .MuiDrawer-paper': {
                        width: 240,
                        height: '100vh',
                        boxSizing: 'border-box',
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Tooltip title="back" style={{display:"flex",cursor:"pointer"}} color="primary" arrow onClick={handleHome}>
                      <SvgIcon>
                      <ArrowBackIcon  />
                      </SvgIcon>
                    </Tooltip>
                      
                      <Avatar
                        sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }}
                      ><Person4Icon
                      sx={{ width: 80, height: 80, margin: 'auto', mb: 2,color:  'black', }}/></Avatar>
                      <Typography variant="h6" gutterBottom>
                        
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ADMIN
                      </Typography>
                    </Box>
                    <Divider />
                    <List>
                      <ListItem button>
                        <ListItemText primary="Profile" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Settings" />
                      </ListItem>
                      <ListItem button>
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </List>
                  </Drawer>
              <Box style={{width:"100%"}}>
              <Typography variant="h4" gutterBottom>
            Welcome to Admin Dashboard
          </Typography>
          <Card style={{ marginBottom: '20px'  }} >
            <CardContent>
            <Tooltip title="Add New bus" arrow>   
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor:"pointer" }} onClick={() => setAddBusExpanded(!addBusExpanded)} >
                <Typography variant="h5">Add New Bus</Typography>
                <SvgIcon   color='primary'>
                  {addBusExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </SvgIcon>
              </div>
            </Tooltip>
            

              <Collapse in={addBusExpanded} >
                <form>
                  <FormControl sx={{ mt: 2 }}>
                    <Input
                      placeholder="Enter Bus ID"
                      name="busId"
                      value={newBusData.busId}
                      onChange={handleChangeAddNewBus}
                    />
                  </FormControl>

                  <FormControl  sx={{ mt: 2 }}>
                    <Input
                      placeholder="Enter Route"
                      name="route"
                      value={newBusData.route}
                      onChange={handleChangeAddNewBus}
                    />
                  </FormControl>

                  <FormControl  sx={{ mt: 2 }}>
                    <Input
                      placeholder="Enter Starting Point"
                      name="startingPoint"
                      value={newBusData.startingPoint}
                      onChange={handleChangeAddNewBus}
                    />
                  </FormControl>

                  <FormControl  sx={{ mt: 2 }}>
                    <Input
                      placeholder="Enter Ending Point"
                      name="endingPoint"
                      value={newBusData.endingPoint}
                      onChange={handleChangeAddNewBus}
                    />
                  </FormControl>

                  <FormControl  sx={{ mt: 2 }}>
                    <Input
                      placeholder="Enter Total Fare"
                      name="totalFare"
                      type="number"
                      value={newBusData.totalFare}
                      onChange={handleChangeAddNewBus}
                    />
                  </FormControl>

                  <Button
                    color="primary"
                    
                    sx={{ mt: 3 }}
                    onClick={handleAddBus}
                  >
                    Add Bus
                  </Button>
                </form>
              </Collapse>
            </CardContent>
          </Card>

          {existbuses.map((bus) => (
            <Card key={bus.busId} style={{ marginBottom: '20px' }}>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DirectionsBus fontSize="large" />
                  <Typography variant='h6'> {bus.busId}.</Typography>
                  <Typography variant="h6">{bus.route}</Typography>
                  <Tooltip title="Edit" arrow>   
                  <SvgIcon onClick={() => handleEditBusClick(bus)} color='primary' fontSize='small' sx={{ cursor: 'pointer' }}>
                    <EditIcon />
                  </SvgIcon>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>   
                  <SvgIcon color='primary' fontSize='small' sx={{ cursor: 'pointer' }}>
                    <DeleteIcon />
                  </SvgIcon>
                  </Tooltip>
                  <Tooltip title="More" arrow>   
                  <SvgIcon onClick={() => handleBusExpand(bus.busId)} color='primary' sx={{ cursor: 'pointer' }}>
                    {busExpanded[bus.busId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </SvgIcon>
                  </Tooltip>
                </div>
                <Typography variant="body1">
                  <strong>Start:</strong> {bus.startingPoint} | <strong>End:</strong> {bus.endingPoint} |{' '}
                  <strong>Fare:</strong> {bus.totalFare}
                </Typography>

                <Collapse in={busExpanded[bus.busId]}>
                  <div style={{ marginTop: '10px' }}>
                  <Tooltip title="Add New Stop" arrow>   
                    <SvgIcon
                      color='primary'
                      onClick={() => setAddStopExpanded((prev) => ({ ...prev, [bus.busId]: !prev[bus.busId] }))}
                      style={{cursor:"pointer"}}
                      >
                      {addStopExpanded[bus.busId] ? <CancelIcon /> : <AddCircleIcon />}
                    </SvgIcon>
                      </Tooltip>
                    <Collapse in={addStopExpanded[bus.busId]}>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <Input
                          placeholder="Stop Name"
                          name="stopName"
                          value={newBusStop.stopName}
                          onChange={handleChangeAddNewBusStop}
                        />
                        <Input
                          placeholder="Fare"
                          name="fare"
                          type="number"
                          value={newBusStop.fare}
                          onChange={handleChangeAddNewBusStop}
                        />
                        <Button variant="outlined" onClick={() => handleAddBusStop(bus.busId)}>
                          <Typography>Add Stop</Typography>
                        </Button>
                      </div>
                    </Collapse>
                  </div>

                  {busStops[bus.busId] && (
                    <div style={{ marginTop: '10px' }}>
                      <Typography variant="h6">Bus Stops:</Typography>
                      <List>
                        {busStops[bus.busId].map((stop) => (
                          <ListItem key={stop.stopId}>
                            <ListItemText primary={stop.stopName} secondary={`Fare: ${stop.fareFromStart}`} />
                            <Tooltip title="Edit" arrow>  
                            <SvgIcon onClick={() => handleEditStopClick(stop)} color='primary' fontSize='small' sx={{ cursor: 'pointer', paddingRight: '20px' }}>
                              <EditIcon />
                            </SvgIcon>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>  
                            <SvgIcon onClick={()=> handleDeleteBusStop(stop.stopId)} color='primary' fontSize='small' sx={{ cursor: 'pointer' }}>
                              <DeleteIcon />
                            </SvgIcon>
                            </Tooltip>
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  )}
                </Collapse>
              </CardContent>
            </Card>
          ))}

          
          <Dialog open={editBusOpen} onClose={() => setEditBusOpen(false)}>
            <DialogTitle>Update Bus</DialogTitle>
            <DialogContent>
              <Input
                margin="dense"
                label="Bus ID"
                name="busId"
                fullWidth
                disabled
                value={selectedBus?.busId || ''}
                onChange={(e) => setSelectedBus({ ...selectedBus, busId: e.target.value })}
              />
              <Input
                margin="dense"
                label="Route"
                name="route"
                fullWidth
                value={selectedBus?.route || ''}
                onChange={(e) => setSelectedBus({ ...selectedBus, route: e.target.value })}
                
              />
              <Input
                margin="dense"
                label="Starting Point"
                name="startingPoint"
                fullWidth
                value={selectedBus?.startingPoint || ''}
                onChange={(e) => setSelectedBus({ ...selectedBus, startingPoint: e.target.value })}
              />
              <Input
                margin="dense"
                label="Ending Point"
                name="endingPoint"
                fullWidth
                value={selectedBus?.endingPoint || ''}
                onChange={(e) => setSelectedBus({ ...selectedBus, endingPoint: e.target.value })}
              />
              <Input
                margin="dense"
                label="Total Fare"
                name="totalFare"
                type="number"
                fullWidth
                value={selectedBus?.totalFare || ''}
                onChange={(e) => setSelectedBus({ ...selectedBus, totalFare: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditBusOpen(false)}>Cancel</Button>
              <Button onClick={() => handleUpdateBus(selectedBus.busId,selectedBus)}>Update</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={editStopOpen} onClose={() => setEditStopOpen(false)}>
            <DialogTitle>Update Bus Stop</DialogTitle>
            <DialogContent>
              <Input
                margin="dense"
                label="Stop Name"
                name="stopName"
                fullWidth
                value={selectedStop?.stopName || ''}
                onChange={(e) => setSelectedStop({ ...selectedStop, stopName: e.target.value })}
              />
              <Input
                margin="dense"
                label="Fare"
                name="fare"
                type="number"
                fullWidth
                value={selectedStop?.fareFromStart || ''}
                onChange={(e) => setSelectedStop({ ...selectedStop, fareFromStart: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditStopOpen(false)}>Cancel</Button>
              <Button onClick={() => handleUpdateBusStop(selectedStop.stopId,selectedStop)}>Update</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    );
  };