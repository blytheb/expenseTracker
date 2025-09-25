import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

import InfoCard from '../../components/cards/InfoCard';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import FinanceOverview from '../../components/dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/dashboard/ExpenseTransactions';

import {LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from 'react-icons/io'
import { addThousandsSeperator } from '../../utils/helper';
import Last30DaysExpenses from '../../components/dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/dashboard/RecentIncome';


const HomePage = () => {
  useUserAuth();

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("something went wrong. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  },[]);
  
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeperator(dashboardData?.totalBalance) || 0}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeperator(dashboardData?.totalIncome) || 0}
            color="bg-orange-500"
          />

            <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeperator(dashboardData?.totalExpense) || 0}
            color="bg-red-500"
          />
          
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <RecentTransactions
          transactions={dashboardData?.recentTransactions}
          onSeeMore={()=> navigate("/expense")}
          />

          <FinanceOverview
            totalBalance= {dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense= {dashboardData?.totalExpenses || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
            />

            <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
            />

            <RecentIncome
              transactions={dashboardData?.last60DaysIncome?.transactions}
              onSeeMore={()=> navigate("/income")}
            />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default HomePage;