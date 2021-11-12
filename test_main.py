import one_stock
import MTP
import json


def main():

    one_stock = True

    # get one stock data
    if one_stock is True:
        return one_stock.main()

    # get combinations
    else:
        return json.dumps(MTP.port_variance.tolist()),\
               json.dumps(MTP.port_returns.tolist()), \
               json.dumps(MTP.target_variance.tolist()),\
               json.dumps(MTP.target_returns.tolist())


if __name__ == '__main__':
    print(main())
