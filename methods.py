import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
from pandas_datareader import data as pdr

import numpy as np
import scipy.stats as scs
import scipy.optimize as sco
import json


def md(first_money, df):
    # data = data[:100]
    df = df[:]
    df[['Close', 'ma5', 'ma30']].plot()

#   plt.show()

    sr1 = df['ma5'] < df['ma30']
    sr2 = df['ma5'] >= df['ma30']

    death_cross = df[sr1 & sr2.shift(1)].index
    golden_cross = df[-(sr1 | sr2.shift(1))].index

    money = first_money
    hold = 0
    sr1 = pd.Series(1, index=golden_cross)
    sr2 = pd.Series(0, index=death_cross)
    sr = sr1.append(sr2)

    sr = sr.sort_index()

    for i in range(0, len(sr)):
        price = df['Open'][sr.index[i]]
        if sr.iloc[i] == 1:
            buy = money // (100 * price)

            hold += buy * 100
            money -= buy * 100 * price
        else:
            money += hold * price
            hold = 0

    price = df['Open'][-1]
    now_money = hold * price + money

    return now_money - first_money

def get_CCI(df, N):
    '''
         Commodity Channel Index

principle:
     Use the current stock price volatility to compare with the normal distribution range to draw the conclusion of overbought or oversold, which is used to capture trend reversal points.
algorithm:
　 The difference between the typical price and the N-day moving average of the typical price divided by the average absolute deviation of the typical price in N days.
usage:
     When CCI is less than -100, it is a buy signal, and when CCI is greater than 100, it is a sell signal;
     When the stock price diverges, it is an obvious warning signal.
parameter:
     N　 sets the number of days for calculating the moving average, generally 14.'''

    df['typ'] = (df['High'] + df['Low'] + df['Close']) / 3

    df['CCI'] = ((df['typ'] - df['typ'].rolling(N).mean()) /
                 (0.015 * abs(df['typ'] - df['typ'].rolling(N).mean()).rolling(N).mean()))
    return df


#  Relative strength index
"""It analyzes the intention and strength of market orders by calculating the percentage of volatility caused by price increases to 
the total volatility through the average number of closing increases and decreases over a period of time."""

"""
RSI must be a number between 0 and 100. The larger the RSI value, the larger the proportion of the fluctuation caused 
by the price increase in the whole period of time. When the RSI exceeds 70, we believe that the increase is too strong, 
and then it is likely to reverse and fall, so the area above 70 is defined as an overbought area and should be sold. Conversely, 
we define the area below 30 as an oversold area and should be bought. Note that the threshold settings of 30 and 70 here are not absolute. According to different targets, 
different market conditions, and the risk appetite of different investors, it can be adjusted appropriately.
"""


def RSI(Close, period):
    Chg = Close - Close.shift(1)
    Chg_pos = pd.Series(index=Chg.index, data=Chg[Chg > 0])
    Chg_pos = Chg_pos.fillna(0)
    Chg_neg = pd.Series(index=Chg.index, data=-Chg[Chg < 0])
    Chg_neg = Chg_neg.fillna(0)

    import numpy as np
    up_mean = []
    down_mean = []
    for i in range(period + 1, len(Chg_pos) + 1):
        up_mean.append(np.mean(Chg_pos.values[i - period:i]))
        down_mean.append(np.mean(Chg_neg.values[i - period:i]))

    rsi = []
    for i in range(len(up_mean)):
        rsi.append(100 * up_mean[i] / (up_mean[i] + down_mean[i]))
    rsi_series = pd.Series(index=Close.index[period:], data=rsi)
    return rsi_series


def common_size(stock):
    csbs = stock.quarterly_balance_sheet
    csis = stock.quarterly_financials
    cscf = stock.quarterly_cashflow


    for i, count in enumerate(csbs.loc['Total Assets', :]):
        csbs.iloc[:, i] = csbs.iloc[:, i] / count
    for i, count in enumerate(csis.loc['Total Revenue', :]):
        csis.iloc[:, i] = csis.copy().iloc[:, i] / count
        cscf.iloc[:, i] = cscf.iloc[:, i] / count

    return csbs, csis, cscf






