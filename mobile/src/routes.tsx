import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/home';
import CollectPoints from './pages/collectPoints';
import Detail from './pages/detail';

const AppStack =  createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator 
                headerMode="none" 
                screenOptions={{
                    cardStyle: {
                        backgroundColor: '#f0f0f5'
                    }
                }}
            >
                <AppStack.Screen name="Home" component={Home} />
                <AppStack.Screen name="CollectPoints" component={CollectPoints} />
                <AppStack.Screen name="Detail" component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;