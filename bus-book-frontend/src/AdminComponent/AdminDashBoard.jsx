import React, { useEffect, useState } from 'react';
import { AddbusStop, AddNewBus, getAllBusData, getBusStop } from '../Service/service';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Input,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Drawer,
  Box,
  Avatar,
  Divider,
  SvgIcon,
} from '@mui/material';
import Button from '@mui/joy/Button';
import AddIcon from '@mui/icons-material/Add';
import { DirectionsBus } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Person4Icon from '@mui/icons-material/Person4';

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

  const handleBusExpand = (busId) => {
    setBusExpanded((prev) => ({ ...prev, [busId]: !prev[busId] }));
    if (!busStops[busId]) {
      fetchBusStops(busId);
    }
  };

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
          
          <Avatar
            sx={{ width: 80, height: 80, margin: 'auto', mb: 2 }}
          ><Person4Icon
           sx={{ width: 80, height: 80, margin: 'auto', mb: 2,color:  'black', }}/></Avatar>
          <Typography variant="h6" gutterBottom>
            {}
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

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Admin Dashboard
        </Typography>
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h5">Add New Bus</Typography>
              <SvgIcon onClick={() => setAddBusExpanded(!addBusExpanded)} style={{width:"30px",height:"30px"}}  color='primary'>
                {addBusExpanded ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
              </SvgIcon>
            </div>

            <Collapse in={addBusExpanded}>
              <form>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Input
                    placeholder="Enter Bus ID"
                    name="busId"
                    value={newBusData.busId}
                    onChange={handleChangeAddNewBus}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Input
                    placeholder="Enter Route"
                    name="route"
                    value={newBusData.route}
                    onChange={handleChangeAddNewBus}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Input
                    placeholder="Enter Starting Point"
                    name="startingPoint"
                    value={newBusData.startingPoint}
                    onChange={handleChangeAddNewBus}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Input
                    placeholder="Enter Ending Point"
                    name="endingPoint"
                    value={newBusData.endingPoint}
                    onChange={handleChangeAddNewBus}
                  />
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Input
                    placeholder="Enter Total Fare"
                    name="totalFare"
                    type="number"
                    value={newBusData.totalFare}
                    onChange={handleChangeAddNewBus}
                  />
                </FormControl>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={handleAddBus}
                >
                  Add Bus
                </Button>
              </form>
            </Collapse>
          </CardContent>
        </Card>

        {/* Existing Buses */}
        {existbuses.map((bus) => (
          <Card key={bus.busId} style={{ marginBottom: '20px' }}>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DirectionsBus fontSize="large" />
                <Typography variant='h6'> {bus.busId}.</Typography>
                <Typography variant="h6">{bus.route}</Typography>
                <SvgIcon onClick={() => handleBusExpand(bus.busId)} color='primary'>
                  {busExpanded[bus.busId] ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                </SvgIcon>
              </div>
              <Typography variant="body1">
                <strong>Start:</strong> {bus.startingPoint} | <strong>End:</strong> {bus.endingPoint} |{' '}
                <strong>Fare:</strong> {bus.totalFare}
              </Typography>

              <Collapse in={busExpanded[bus.busId]}>
                <div style={{ marginTop: '10px' }}>
                  <SvgIcon
                  color='primary'
                    onClick={() => setAddStopExpanded((prev) => ({ ...prev, [bus.busId]: !prev[bus.busId] }))}
                  >
                    {addStopExpanded[bus.busId] ? <CancelIcon/> : <AddCircleIcon/>}
                  </SvgIcon>
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
                      <Button variant="outlined"  onClick={() => handleAddBusStop(bus.busId)}>
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
                          
                          <ListItemText  primary={stop.stopId+". "+stop.stopName} secondary={`Fare: ${stop.fareFromStart}`} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};