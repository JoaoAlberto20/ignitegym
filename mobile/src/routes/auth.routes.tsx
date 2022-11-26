import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SignIn } from '@screens/SignIn';
import { SignUp } from '@screens/SignUp';

type AuthRoutes = {
  signIn: undefined
  SignUp: undefined
}

export type AuthNavigationRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Screen, Navigator } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false } }> 
      <Screen
        name="signIn"
        component={SignIn}
      />
      <Screen
        name="SignUp"
        component={SignUp}
      />
    </Navigator>
  )
}