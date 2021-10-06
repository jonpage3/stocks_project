from flask import (Flask, Response, request, render_template, make_response,
                   redirect, url_for)
from flask_restful import Api, Resource, reqparse, abort
import yfinance as yf
import matplotlib.pyplot as plt
import pandas as pd
from pandas_datareader import data as pdr
import datetime
import webbrowser

new_request_parser = reqparse.RequestParser()
for arg in ['name','first_money']:
    new_request_parser.add_argument(
        arg, required=False)


def md(name, first_money, df):
    df['ma5'] = df.loc[:, 'Close'].rolling(5).mean()
    df['ma30'] = df.loc[:, 'Close'].rolling(30).mean()
    # data = data[:100]
    df = df[:]
    # df[['Close', 'ma5', 'ma30']].plot()
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

"""class Stock_results(Resource):

    def get(self):
        request = new_request_parser.parse_args()
        name = request['name']
        try:
            first_money = float(request['first_money'])
        except ValueError:
            result = 'enter a valid number for money'
            first_money = request['first_money']


        yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
        yesterday.strftime('%Y-%m-%d')


        try:
            df = pdr.get_data_yahoo(name, end=yesterday)
            result = ''
            if isinstance(first_money, float):
                results = md(name, first_money, df)
            else:
                empty_df = pd.DataFrame()
                empty_df['nothing to see here'] = 'nothing to see here'
                results = (0, empty_df)
                result = "Please enter a valid money amount."
        except Exception:
            empty_df = pd.DataFrame()
            empty_df['nothing to see here'] = 'nothing to see here'
            results = (0, empty_df)
            result = 'Not valid Stock, check the ticker symbol'


        return make_response(render_template('home.html',
                                             request=request, earnings=results[0],
                                             tables=[results[1].to_html(classes='data')],
                                             titles=results[1].columns.values,
                                             result=result), '200') """



app = Flask(__name__)
api = Api(app)
api.add_resource(Home,'/home')
#api.add_resource(Stock_results,'/stock_results')

@app.route('/search',methods=["POST"])
def return_stock_info():
    name = request.form.get("name")
    #first_money = request.form.get("first_money")
    try:
        first_money = float(request.form.get("first_money"))
    except ValueError:
        result = 'enter a valid number for money'
        first_money = request.form.get("first_money")

    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    yesterday.strftime('%Y-%m-%d')

    try:
        df = pdr.get_data_yahoo(name, end=yesterday)
        result = ''
        if isinstance(first_money, float):
            results = md(name, first_money, df)
        else:
            empty_df = pd.DataFrame()
            empty_df['nothing to see here'] = 'nothing to see here'
            results = (0, empty_df)
            result = "Please enter a valid money amount."
    except Exception:
        empty_df = pd.DataFrame()
        empty_df['nothing to see here'] = 'nothing to see here'
        results = (0, empty_df)
        result = 'Not valid Stock, check the ticker symbol'

    return render_template('stock_results.html',name=name,first_money=first_money, earnings=results[0],
                                             tables=[results[1].to_html(classes='data')],
                                             titles=results[1].columns.values,
                                             result=result),200

@app.route('/')
def index():

    return redirect(api.url_for(Home), code=303)

if __name__ == '__main__':
    webbrowser.open_new("http://127.0.0.1:5000/")
    app.run()

