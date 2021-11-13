import yfinance as yf
import datetime
from pandas_datareader import data as pdr
import sys
from pandas_datareader._utils import RemoteDataError
import methods
import json


def main():
    all_stocks = []

    name = input('Stock abb ')
    first_money = input('Money ')

    all_stocks.append(name)
    stock = yf.Ticker(name)
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    yesterday = yesterday.strftime('%Y-%m-%d')


    try:
        df = pdr.get_data_yahoo(name, end=yesterday)
    except RemoteDataError:
        print('Not valid Stock')
        sys.exit()

    df['ma5'] = df.loc[:, 'Close'].rolling(5).mean()
    df['ma30'] = df.loc[:, 'Close'].rolling(30).mean()
    df = methods.get_CCI(df, 14)
    rsi = methods.RSI(df.loc[:, 'Close'], 14)
    df['RSI'] = rsi

    macd_result = methods.md(first_money, df)

    # data
    common_size_bs, \
    common_size_is, \
    common_size_cf = methods.common_size(stock)

    return json.dumps(stock.info), macd_result, df.to_json(), common_size_bs.to_json(), \
           common_size_is.to_json(), common_size_cf.to_json(),


