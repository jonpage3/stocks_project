import one_stock
import json


def main():

    one = True

    # get one stock data
    if one is True:
        return one_stock.main()

    else:
        import MTP

        return json.dumps(MTP.port_variance.tolist()),\
               json.dumps(MTP.port_returns.tolist()), \
               json.dumps(MTP.target_variance.tolist()),\
               json.dumps(MTP.target_returns.tolist())


if __name__ == '__main__':
    print(main())
