import { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import ApiService from '../../services/api';
import { GET, prayerTimesURL } from '../../services/constants';
import CommonStyles from '../../assets/styles/CommonStyles';

const ScreenWrapper = ({ children, refreshAct }) => {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        refreshAct()
        setRefreshing(false);
    };

    return (
        <ScrollView scrollEnabled={false}
        contentContainerStyle={CommonStyles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {children}
        </ScrollView>
    );
};

export default ScreenWrapper
