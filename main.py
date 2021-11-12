from flask import (Flask, Response, request, render_template, make_response,
                   redirect, url_for,jsonify)
from flask_restful import Api, Resource, reqparse, abort
import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
from pandas_datareader import data as pdr
import datetime
import webbrowser

#helper functions for data analysis
#these functions will be use by function
#return_stock_info
def md(name, first_money, df):
    df['ma5'] = df.loc[:, 'Close'].rolling(5).mean()
    df['ma30'] = df.loc[:, 'Close'].rolling(30).mean()
    # data = data[:100]
    df = df[:]
    # df[['Close', 'ma5', 'ma30']].plot()
    #
    # plt.show()

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
    earnings = int(now_money - first_money)

    stock = yf.Ticker(name)
    # stock cashflow
    stock_cf = stock.cashflow

    return earnings, stock_cf


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
    stock_info = stock.info
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    yesterday.strftime('%Y-%m-%d')


    # code for returning html using the stock_results.html template
    #return render_template('stock_results.html',name=name,first_money=first_money, earnings=results[0],
    #                                       tables=[results[1].to_html(classes='data')],
    #                                        titles=results[1].columns.values,
    #                                        result=result),200

    # use this to render data in json format with jsonify
    #figure out different way to orient dataframes
    return jsonify(name=name,stock_info=stock_info)


@app.route('/')
def index():
    return redirect(api.url_for(Home), code=303)

if __name__ == '__main__':
    webbrowser.open_new("http://127.0.0.1:5000/")
    app.run()

