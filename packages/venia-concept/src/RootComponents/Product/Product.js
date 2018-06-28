import { Component, createElement } from 'react';
import { bool, shape, number, arrayOf, string } from 'prop-types';

import getUrlKey from 'src/util/getUrlKey';
import Page from 'src/components/Page';
import ProductFullDetail from 'src/components/ProductFullDetail';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import { addItemToCart } from 'src/actions';

const productDetailQuery = gql`
    query productDetail($urlKey: String) {
        productDetail: products(filter: { url_key: { eq: $urlKey } }) {
            items {
                sku
                name
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                description
                media_gallery_entries {
                    label
                    position
                    disabled
                    file
                }
            }
        }
    }
`;

class Product extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        data: shape({
            productDetail: shape({
                total_count: number,
                items: arrayOf(
                    shape({
                        id: number,
                        sku: string.isRequired,
                        price: shape({
                            regularPrice: shape({
                                amount: shape({
                                    currency: string.isRequired,
                                    value: number.isRequired
                                })
                            }).isRequired
                        }).isRequired,
                        image: string,
                        image_label: string,
                        media_gallery_entries: arrayOf(
                            shape({
                                label: string,
                                position: number.isRequired,
                                disabled: bool,
                                file: string.isRequired
                            })
                        ),
                        description: string,
                        short_description: string,
                        canonical_url: string
                    })
                ).isRequired
            }).isRequired
        })
    };

    addToCart = (item, quantity) =>
        this.props.addItemToCart({ item, quantity });

    render() {
        return (
            <Page>
                <Query
                    query={productDetailQuery}
                    variables={{ urlKey: getUrlKey() }}
                >
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;

                        const product = data.productDetail.items[0];

                        return (
                            <ProductFullDetail
                                product={product}
                                onClickAddToCart={this.addToCart}
                            />
                        );
                    }}
                </Query>
            </Page>
        );
    }
}

export default connect(
    null,
    {
        addItemToCart
    }
)(Product);
