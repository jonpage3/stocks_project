import yfinance as yf
import datetime
import numpy as np
import scipy.optimize as sco


yesterday = datetime.datetime.now() - datetime.timedelta(days=1)


all_stocks = ["MS","MSFT","AMZN","TSLA","GS"]

all_dfs = yf.download(all_stocks, end = yesterday).loc[:, 'Close']

log_returns = np.log(all_dfs.pct_change()+1)
log_returns.mean()*252


port_returns = []
port_variance = []
for p in range(1000):
    weights = np.random.random(len(all_stocks))
    weights /=np.sum(weights)
    port_returns.append(np.sum(log_returns.mean()*252*weights))
    port_variance.append(np.sqrt(np.dot(weights.T, np.dot(log_returns.cov()*252, weights))))

port_returns = np.array(port_returns)
port_variance = np.array(port_variance)




# risk_free = 0.03
# plt.figure(figsize=(8, 6))
# plt.scatter(port_variance, port_returns, c=(port_returns-risk_free)/port_variance, marker = 'o')
# plt.grid(True)
# plt.xlabel('Expected Volatility')
# plt.ylabel('Expected Return')
# plt.colorbar(label = 'Sharpe Ratio')


def stats(weights):
    weights = np.array(weights)
    port_returns = np.sum(log_returns.mean()*weights)*252
    port_variance = np.sqrt(np.dot(weights.T, np.dot(log_returns.cov()*252,weights)))
    return np.array([port_returns, port_variance, port_returns/port_variance])


def min_sharpe(weights):
    return -stats(weights)[2]


x0 = 5*[1./5]

bnds = tuple((0,1) for x in range(len(all_stocks)))


cons = ({'type':'eq', 'fun':lambda x: np.sum(x)-1})

opts = sco.minimize(min_sharpe,
                    x0,
                    method = 'SLSQP',
                    bounds = bnds,
                    constraints = cons)


def min_variance(weights):
    return stats(weights)[1]


optv = sco.minimize(min_variance,
                    x0,
                    method = 'SLSQP',
                    bounds = bnds,
                    constraints = cons)


def min_variance(weights):
    return stats(weights)[1]


target_returns = np.linspace(0.0,0.5,50)
target_variance = []
for tar in target_returns:
    cons = ({'type':'eq','fun':lambda x:stats(x)[0]-tar},{'type':'eq','fun':lambda x:np.sum(x)-1})
    res = sco.minimize(min_variance, x0, method = 'SLSQP', bounds = bnds, constraints = cons)
    target_variance.append(res['fun'])

target_variance = np.array(target_variance)



# plt.figure(figsize = (8,4))
#
# plt.scatter(port_variance, port_returns, c = port_returns/port_variance,marker = 'o')
#
# plt.scatter(target_variance,target_returns, c = target_returns/target_variance, marker = 'x')
#
# plt.plot(stats(opts['x'])[1], stats(opts['x'])[0], 'r*', markersize = 15.0)
#
# plt.plot(stats(optv['x'])[1], stats(optv['x'])[0], 'y*', markersize = 15.0)
#
# plt.grid(True)
# plt.xlabel('expected volatility')
# plt.ylabel('expected return')
# plt.colorbar(label = 'Sharpe ratio')
#
# plt.show()

