import React from 'react'
import Relay from 'react-relay'

import Artwork from './artwork'

export class Grid extends React.Component {
  // state: {
  //   sectionDimension: number,
  //   sectionCount: number,
  // };

  static defaultProps = {
    // sectionDirection: 'column',
    sectionMargin: 20,
    itemMargin: 20,
  }

  constructor(props) {
    super(props)
    this.state = {
      // sectionDimension: 0,
      sectionCount: 3,
    }

    // this.onLayout = this.onLayout.bind(this)
  }

  // layoutState(currentLayout) : Object {
  //   const width = currentLayout.width
  //   const isPad = width > 600
  //   const isPadHorizontal = width > 900

  //   const sectionCount = isPad ? (isPadHorizontal ? 4 : 3) : 2
  //   const sectionMargins = this.props.sectionMargin * (sectionCount - 1)
  //   const sectionDimension = (currentLayout.width - sectionMargins) / sectionCount

  //   return { sectionCount: sectionCount,
  //            sectionDimension: sectionDimension,
  //         }
  // }

  // onLayout = (event: LayoutEvent) => {
  //   const layout = event.nativeEvent.layout
  //   const newLayoutState = this.layoutState(layout)
  //   if (layout.width > 0) {
  //     this.setState(newLayoutState)
  //   }
  // }

  sectionedArtworks() {
    const sectionedArtworks = []
    const sectionRatioSums = []
    for (let i = 0; i < this.state.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }

    const artworks = this.props.artworks
    for (let i = 0; i < artworks.length; i++) {
      const artwork = artworks[i]

      if (artwork.image) {
        let lowestRatioSum = Number.MAX_VALUE
        let sectionIndex: ?number = null

        for (let j = 0; j < sectionRatioSums.length; j++) {
          const ratioSum = sectionRatioSums[j]
          if (ratioSum < lowestRatioSum) {
            sectionIndex = j
            lowestRatioSum = ratioSum
          }
        }

        if (sectionIndex != null) {
          const section = sectionedArtworks[sectionIndex]
          section.push(artwork)

          // total section aspect ratio
          const aspectRatio = artwork.image.aspect_ratio || 1
          sectionRatioSums[sectionIndex] += (1 / aspectRatio)
        }
      }
    }
    return sectionedArtworks
  }

  renderSections() {
    // const spacerStyle = {
    //   height: this.props.itemMargin,
    // }
    const sectionedArtworks = this.sectionedArtworks()
    const sections = []
    for (let i = 0; i < this.state.sectionCount; i++) {
      const artworkComponents = []
      const artworks = sectionedArtworks[i]
      for (let j = 0; j < artworks.length; j++) {
        const artwork = artworks[j]
        artworkComponents.push(<Artwork artwork={artwork} key={artwork.__id} />)
        if (j < artworks.length - 1) {
          // artworkComponents.push(<div style={spacerStyle} key={'spacer-' + j} accessibilityLabel="Spacer div" />)
          artworkComponents.push(<div className='spacer' key={'spacer-' + j} />)
        }
      }

      // const sectionSpecificStlye = {
      //     width: this.state.sectionDimension,
      //     marginRight: (i === this.state.sectionCount - 1 ? 0 : this.props.sectionMargin),
      // }
      sections.push(
        // <div style={[styles.section, sectionSpecificStlye]} key={i} accessibilityLabel={'Section ' + i}>
        <div style={styles.column} key={i}>
          {artworkComponents}
        </div>
      )
    }
    return sections
  }

  render() {
    return <div style={styles.container}>{this.renderSections()}</div>
  }
}

// .grid {
//   display: flex;
//   flex-direction: row;
// }

// .grid .column {
//   flex-direction: column;
//   flex: 1 0 0px;
//   max-width: 300px;
//   margin-right: 20px;
// }

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
    flex: '1 0 0px',
    maxWidth: 300,
    marginRight: 20,
  },
}

export default Relay.createContainer(Grid, {
  fragments: {
    artworks: () => Relay.QL`
      fragment on Artwork @relay(plural: true) {
        __id
        image {
          aspect_ratio
        }
        ${Artwork.getFragment('artwork')}
      }
    `,
  },
})
