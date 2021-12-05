from flask import (Flask, Response, request, render_template, make_response,
                   redirect, url_for,jsonify)
from flask_restful import Api, Resource, reqparse, abort
import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
from pandas_datareader import data as pdr
from pandas_datareader._utils import RemoteDataError
import methods
import datetime
import simplejson as json
import sys
import time
import webbrowser

# home page of search
class Home(Resource):

    def get(self):
        return make_response(render_template('index.html'),'200')

app = Flask(__name__)
api = Api(app)
api.add_resource(Home,'/home')

#function 'return_stock_info' returns stock data
#for name = stock_ticker
@app.route('/search',methods=["POST"])
def return_stock_info():
    name = request.form.get("name")

    stock = yf.Ticker(name)
    #stock_info = stock.info
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    yesterday.strftime('%Y-%m-%d')
    df = pdr.get_data_yahoo(name, end=yesterday)
    df['ma5'] = df.loc[:, 'Close'].rolling(5).mean()
    df['ma30'] = df.loc[:, 'Close'].rolling(30).mean()
    df = methods.get_CCI(df, 14, 100000)
    # rsi = methods.RSI(df.loc[:, 'Close'], 14)
    # df['RSI'] = rsi
    df = methods.RSI(df, 14, 10000)

    #the following code allows us to add stock data
    #to a dictionary
    #first convert df to dict
    df_dict = df.to_dict()
    #initialize stock data dict
    stock_data = {}
    #this for loop specifies all the data has the right timestamp
    for key in df_dict:
        stock_data[key] = {}
        for key2,val in df_dict[key].items():
            dat_conv = key2.to_pydatetime()
            unix_string = str(int(datetime.datetime.timestamp(dat_conv) * 1000))
            stock_data[key][unix_string] = df_dict[key][key2]
    stock_data['name'] = name
    stock_data["stock_info"] = stock.info

    #get ticker ratings
    ticker = yf.Ticker(name)
    ticker_rec = ticker.recommendations.loc[:,'To Grade'][(ticker.recommendations.loc[:,'To Grade'] != 'In-Line') & (ticker.recommendations.loc[:,'To Grade'] != 'Outperform') & (ticker.recommendations.loc[:,'To Grade'] != 'Underperform') & (ticker.recommendations.loc[:,'To Grade'] != 'Equal-Weight') & (ticker.recommendations.loc[:,'To Grade'] != 'Sector Perform') & (ticker.recommendations.loc[:,'To Grade'] != 'Market Perform') & (ticker.recommendations.loc[:,'To Grade'] != 'Overweight') & (ticker.recommendations.loc[:,'To Grade'] != '') & (ticker.recommendations.loc[:,'To Grade'] != 'Strong Buy') & (ticker.recommendations.loc[:,'To Grade'] != 'Positive') & (ticker.recommendations.loc[:,'To Grade'] != 'Market Outperform') & (ticker.recommendations.loc[:,'To Grade'] != 'Sector Outperform') & (ticker.recommendations.loc[:,'To Grade'] != 'Long-term Buy') & (ticker.recommendations.loc[:,'To Grade'] != 'Reduce') & (ticker.recommendations.loc[:,'To Grade'] != 'Peer Perform') & (ticker.recommendations.loc[:,'To Grade'] != 'Long-Term Buy') & (ticker.recommendations.loc[:,'To Grade'] != 'Neutral') & (ticker.recommendations.loc[:,'To Grade'] != 'Perform') & (ticker.recommendations.loc[:,'To Grade'] != 'Underweight') & (ticker.recommendations.loc[:,'To Grade'] != 'Negative') & (ticker.recommendations.loc[:,'To Grade'] != 'Sector Weight') & (ticker.recommendations.loc[:,'To Grade'] != 'Equal-weight') & (ticker.recommendations.loc[:,'To Grade'] != 'Underperformer') & (ticker.recommendations.loc[:,'To Grade'] != 'Fair Value') & (ticker.recommendations.loc[:,'To Grade'] != 'Mixed') & (ticker.recommendations.loc[:,'To Grade'] != 'Accumulate') & (ticker.recommendations.loc[:,'To Grade'] != 'Top Pick')]
    ticker_buy = ((ticker_rec.values == "Buy").sum() / len(ticker_rec))
    ticker_sell = ((ticker_rec.values == "Sell").sum() / len(ticker_rec))
    ticker_hold = ((ticker_rec.values == "Hold").sum() / len(ticker_rec))
    ticker_buy = "{:.0%}".format(ticker_buy)
    ticker_sell = "{:.0%}".format(ticker_sell)
    ticker_hold = "{:.0%}".format(ticker_hold)
    ticker_rating = {}
    ticker_rating["Buy"] = ticker_buy.removesuffix('%')
    ticker_rating["Hold"] = ticker_hold.removesuffix('%')
    ticker_rating["Sell"] = ticker_sell.removesuffix('%')

    #put ticker_rating in stock_data
    stock_data["ticker_rating"] = ticker_rating

    #uncomment to check that stock_data is right
    #print(stock_data)
    #turn stock_data dictionary into json
    stock_json = json.dumps(stock_data, ignore_nan=True)
    # uncomment to check that stock_json is right
    #print(stock_json)
    return stock_json

@app.route('/')
def index():
    return redirect(api.url_for(Home), code=303)

if __name__ == '__main__':
    webbrowser.open_new("http://127.0.0.1:5000/")
    app.run()

