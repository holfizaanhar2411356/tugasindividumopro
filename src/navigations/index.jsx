import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();


// import screens
import PostIndex from '../screens/posts/index';
import PostCreate from '../screens/posts/create';
import PostEdit from '../screens/posts/edit';
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PostIndex"
          component={PostIndex}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostCreate"
          component={PostCreate}
          options={{title: 'Create Post'}}
        />
        <Stack.Screen
          name="PostEdit"
          component={PostEdit}
          options={{title: 'Edit Post'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
